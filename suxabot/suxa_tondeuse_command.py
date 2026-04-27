"""
Commande Discord /suxa_tondeuse
================================

Quand un utilisateur tape /suxa_tondeuse sur Discord, le bot appelle l'API
backend du jeu pour obtenir un lien d'acces unique valable 1 heure, puis
repond a l'utilisateur avec ce lien (en ephemere).

Variables d'environnement requises sur le VPS (a cote de DISCORD_TOKEN) :
  ROBOMOW_API_URL    URL de base du backend, ex: http://localhost:3100/api
  ROBOMOW_BOT_KEY    Cle partagee avec le backend (DISCORD_BOT_API_KEY)

Coller ce snippet a cote des autres commandes /suxa_* dans suxabot.py.
"""

# === Imports a verifier en haut de suxabot.py ===
# import os
# import httpx          # pip install httpx (ou aiohttp si tu preferes)


@tree.command(
    name="suxa_tondeuse",
    description="Genere un lien d'acces de 1 heure au jeu ROBOMOW TYCOON.",
)
@app_commands.allowed_installs(guilds=True, users=True)
@app_commands.allowed_contexts(guilds=True, dms=True, private_channels=True)
async def suxa_tondeuse(interaction: discord.Interaction):
    await interaction.response.defer(ephemeral=True)
    await log_command(interaction, "suxa_tondeuse")

    api_url = os.getenv("ROBOMOW_API_URL", "http://localhost:3100/api")
    bot_key = os.getenv("ROBOMOW_BOT_KEY")

    if not bot_key:
        await interaction.followup.send(
            "Configuration manquante : ROBOMOW_BOT_KEY non definie.", ephemeral=True
        )
        return

    try:
        import httpx

        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(
                f"{api_url}/auth/invite/issue",
                headers={"X-Bot-Key": bot_key, "Content-Type": "application/json"},
                json={"source": str(interaction.user.id)},
            )
            data = resp.json()

        if resp.status_code != 200 or not data.get("success"):
            err = data.get("error", {}).get("message", "Erreur inconnue")
            await interaction.followup.send(
                f"Impossible de generer le lien : {err}", ephemeral=True
            )
            return

        invite_url = data["data"]["url"]
        expires_at = data["data"]["expiresAt"]
        message = (
            "**ROBOMOW TYCOON**\n"
            f"Voici ton lien d'acces (valable 1 heure) :\n"
            f"{invite_url}\n\n"
            "*Une fois sur la page, inscris-toi avec un pseudo + mot de passe (ou connecte-toi). "
            "Le lien expire le " + expires_at[:16].replace("T", " a ") + " UTC.*"
        )
        await interaction.followup.send(message, ephemeral=True)

    except Exception as e:
        await interaction.followup.send(f"Erreur reseau : {e}", ephemeral=True)

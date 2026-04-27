"""
Commande Discord /suxa_tondeuse — ouvre l'interface web du jeu ROBOMOW TYCOON.

Snippet a coller dans le fichier principal du bot suxabot, a cote des autres
commandes /suxa_*. Suit le meme pattern que /suxa_claude_hq et /suxa_casino :
1. Lit l'URL du tunnel Cloudflare partage depuis /tmp/cloudflare_url.txt.
2. Construit l'URL complete vers le frontend RoboMow Tycoon (route /tondeuse/).
3. Repond a l'utilisateur avec le lien (reponse ephemere).

Le frontend nginx ecoute sur le port 80 du conteneur, expose via Coolify/Traefik.
En dev local on utilise port 5173 (Vite).
"""

# Coller cet import en haut de suxabot.py s'il n'y est pas deja :
# import os

# Coller cette commande dans suxabot.py, dans le bloc des commandes slash.

@tree.command(
    name="suxa_tondeuse",
    description="Ouvre ROBOMOW TYCOON : ton empire de robots tondeuses.",
)
@app_commands.allowed_installs(guilds=True, users=True)
@app_commands.allowed_contexts(guilds=True, dms=True, private_channels=True)
async def suxa_tondeuse(interaction: discord.Interaction):
    await interaction.response.defer(ephemeral=True)
    await log_command(interaction, "suxa_tondeuse")
    try:
        # URL de base : tunnel Cloudflare partage du bot.
        # En dev local on peut surcharger via la variable ROBOMOW_GAME_URL.
        override = os.getenv("ROBOMOW_GAME_URL")
        if override:
            game_url = override.rstrip("/") + "/tondeuse/"
        else:
            with open("/tmp/cloudflare_url.txt", "r", encoding="utf-8") as f:
                base = f.read().strip()
            if not base:
                await interaction.followup.send(
                    "Tunnel Cloudflare non disponible.", ephemeral=True
                )
                return
            game_url = f"{base.rstrip('/')}/tondeuse/"

        message = (
            "**🌱 ROBOMOW TYCOON**\n"
            f"{game_url}\n\n"
            "*Inscris-toi avec un pseudo + mot de passe et commence a tondre !*"
        )
        await interaction.followup.send(message, ephemeral=True)
    except FileNotFoundError:
        await interaction.followup.send(
            "Fichier tunnel introuvable. Lance d'abord cloudflared sur le VPS.",
            ephemeral=True,
        )
    except Exception as e:
        await interaction.followup.send(f"Erreur : {e}", ephemeral=True)

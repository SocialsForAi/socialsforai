"""SocialsForAI: post, schedule and measure on social networks from Python and AI agents.

    from socialsforai import SocialsForAI
    socials = SocialsForAI()  # reads SOCIALSFORAI_API_KEY
    socials.posts.create(["linkedin", "bluesky"], "We just shipped webhooks.", dry_run=True)

Docs: https://socialsforai.com/docs · Agent guide: https://socialsforai.com/llms.txt
"""

from ._client import DEFAULT_BASE_URL, VERSION, SocialsError, SocialsForAI, verify_webhook

__all__ = ["SocialsForAI", "SocialsError", "verify_webhook", "DEFAULT_BASE_URL", "VERSION"]
__version__ = VERSION

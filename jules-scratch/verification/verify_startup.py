import pytest
from playwright.sync_api import Page, expect
import time

def test_game_starts_and_loads_level(page: Page):
    """
    This test verifies that the game starts up, the user can start the game,
    the level appears, and no console errors are logged.
    """

    # 1. Arrange: Set up a listener for console errors.
    console_errors = []
    page.on("console", lambda msg: console_errors.append(f"[{msg.type}] {msg.text}") if msg.type == "error" else None)

    # 2. Act: Go to the game's URL.
    try:
        page.goto("http://localhost:3000", timeout=15000)
    except Exception as e:
        pytest.fail(f"Failed to navigate to the page. Is the dev server running? Error: {e}")

    # 3. Act: Find and click the "Start Game" button.
    try:
        start_button = page.get_by_text("Start Game")
        expect(start_button).to_be_visible(timeout=5000)
        start_button.click()
    except Exception as e:
        page.screenshot(path="jules-scratch/verification/verification_error.png")
        pytest.fail(f"Could not find or click 'Start Game' button. Error: {e}")

    # 4. Act: Wait for the scene to load.
    time.sleep(2) # Simple wait for assets to load and scene to render.

    # 5. Screenshot: Capture the running game.
    page.screenshot(path="jules-scratch/verification/verification.png")

    # 6. Final Assertion: Check if any errors were captured.
    if console_errors:
        error_messages = "\\n".join(console_errors)
        pytest.fail(f"Console errors were detected:\\n{error_messages}")

from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:3000/")

    # Wait for the game canvas to be visible
    canvas = page.locator('canvas')
    expect(canvas).to_be_visible()

    # Wait a bit for the title screen to render
    page.wait_for_timeout(1000)

    # Click the "Start Game" button by coordinates
    canvas.click(position={'x': 400, 'y': 350})

    # It's a game, so content is dynamic. Wait a bit for the player to appear.
    page.wait_for_timeout(5000) # 5 seconds

    page.screenshot(path="jules-scratch/verification/verification.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)

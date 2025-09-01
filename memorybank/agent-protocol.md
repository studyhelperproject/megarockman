# Agent Protocol

## 1. Agent Instructions for Cooperation
- Handle asset generation with detailed prompts describing 8-bit style character sprites, backgrounds, UI elements.
- Automate repetitive tasks such as sprite animation setup, physics tuning, and AI enemy behavior generation.
- Generate code snippets aligned with Phaser.js patterns and project naming conventions.
- Report any ambiguity or missing information to human developers for clarification.
### 1.1. Asset Generation Prompts

When requesting assets, use the following template to provide clear instructions.

**Prompt Template:**
`Generate a [asset_type] for [purpose]. Style: 8-bit, [specific_style (e.g., NES color palette, Rockman 2-like)]. Details: [specific_details (e.g., 32x32 pixels, 4 frames of running animation, transparent background)]. Output format: [format (e.g., PNG sprite sheet)].`

**Example:**
`Generate a sprite sheet for the player's running animation. Style: 8-bit, Rockman 2-like, using the NES color palette. Details: 4 frames of animation on a single row, each frame 32x32 pixels, transparent background. Output format: PNG sprite sheet.`

### 1.2. Task Definition using YAML

For complex or repetitive tasks, define the request in a `.yml` file within the `/scripts/tasks` directory. The agent should parse these files to execute tasks.

**Example Task File (`/scripts/tasks/generate_enemy_assets.yml`):**
```yaml
- task: generate_asset
  asset_name: "Met" # メットール
  type: "sprite_sheet"
  description: "A common small enemy that hides under a helmet."
  specifications:
    style: "8-bit, Rockman 2"
    palette: "NES"
    output_path: "assets/sprites/enemies/met.png"
  animations:
    - name: "idle"
      frames: 2
      description: "Hiding under the helmet, slightly bobbing."
      size_per_frame: "24x24"
    - name: "attack"
      frames: 3
      description: "Lifts helmet and shoots a 3-way bullet."
      size_per_frame: "24x24"
```

## 2. Scope of AI Agent's Work

To ensure focus and prevent unintended changes, the agent should adhere to the following scope:

### In Scope (What to do ✅)
- Generate new assets (sprites, tilesets, backgrounds) and place them in the `/assets` directory.
- Create new game scenes or enemy logic files in the `/src` directory based on explicit instructions.
- Write or modify automation scripts in the `/scripts` directory.
- Refactor code for readability or performance **when specifically asked to**.

### Out of Scope (What NOT to do ❌)
- Do not modify core configuration files like `package.json`, `tsconfig.json`, or `.github/workflows/*.yml` without explicit approval.
- Do not add or remove npm dependencies.
- Do not commit directly to the `main` branch. Always work on a feature branch.

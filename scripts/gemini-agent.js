import fs from 'fs';
import path from 'path';

function simpleYamlParse(content) {
    const lines = content.split('\n');
    const result = [];
    let currentTask = null;
    let currentAnimation = null;

    for (const line of lines) {
        const indent = line.length - line.trimStart().length;
        const trimmed = line.trim();
        if (trimmed.length === 0 || trimmed.startsWith('#')) continue;

        const [rawKey, ...rawValueParts] = trimmed.split(':');
        const value = rawValueParts.join(':').trim().replace(/"/g, '');
        const key = rawKey.trim();

        if (trimmed.startsWith('- task:')) {
            if (currentTask) result.push(currentTask);
            currentTask = { specifications: {}, animations: [] };
            currentTask.task = value;
            currentAnimation = null;
        } else if (indent === 2) { // task-level property
            if (key === 'animations') {
                // This is the list declaration, do nothing.
            } else {
                currentTask[key] = value || {};
            }
        } else if (indent === 4 && key !== 'animations') { // specification property
            if (trimmed.startsWith('-')) { // Start of an animation item
                 if (key.startsWith('- name')) {
                    currentAnimation = {};
                    currentTask.animations.push(currentAnimation);
                    currentAnimation.name = value;
                 }
            } else { // specification property
                currentTask.specifications[key] = value;
            }
        } else if (indent === 6 && currentAnimation) { // animation property
            currentAnimation[key] = value;
        }
    }
    if (currentTask) result.push(currentTask);
    return result;
}


async function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('Usage: node scripts/gemini-agent.js <path_to_task_file>');
        process.exit(1);
    }

    const taskFilePath = args[0];
    console.log(`Reading tasks from: ${taskFilePath}`);

    try {
        const fileContent = fs.readFileSync(taskFilePath, 'utf-8');
        const tasks = simpleYamlParse(fileContent);

        for (const task of tasks) {
            if (task.task === 'generate_asset') {
                await handleGenerateAsset(task);
            } else {
                console.warn(`Unknown task type: ${task.task}`);
            }
        }
    } catch (error) {
        console.error(`Error processing task file: ${error.message}`);
        process.exit(1);
    }
}

async function handleGenerateAsset(task) {
    console.log(`\n--- Handling Asset Generation ---`);
    console.log(`Asset Name: ${task.asset_name}`);
    console.log(`Type: ${task.type}`);
    console.log(`Description: ${task.description}`);
    console.log(`Specifications:`);
    console.log(`  Style: ${task.specifications.style}`);
    console.log(`  Palette: ${task.specifications.palette}`);
    console.log(`  Output Path: ${task.specifications.output_path}`);

    if (task.animations && task.animations.length > 0) {
        console.log(`Animations:`);
        for (const anim of task.animations) {
            console.log(`  - Name: ${anim.name}, Frames: ${anim.frames}, Size: ${anim.size_per_frame}`);
            console.log(`    Description: ${anim.description}`);
        }
    }

    // Simulate API call and file creation
    const outputPath = task.specifications.output_path;
    console.log(`\n[SIMULATION] Calling Gemini API to generate asset...`);
    console.log(`[SIMULATION] Creating file at: ${outputPath}`);

    try {
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(outputPath, `// Placeholder for ${task.asset_name}`);
        console.log(`Successfully created placeholder asset: ${outputPath}`);
    } catch (error) {
        console.error(`Error creating file: ${error.message}`);
    }
}

main();

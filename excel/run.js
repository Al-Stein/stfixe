const { exec } = require("child_process");

// Replace 'python_script.py' with the path to your Python script
const pythonScript = "todb.py";

exec(`python ${pythonScript}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing Python script: ${error}`);
    return;
  }
  console.log(`Python script output: ${stdout}`);
});

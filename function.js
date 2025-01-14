const functions = document.getElementsByClassName("function-dropdown")[0];
console.log(functions);

function onClickFunctions(e) {
  const functionClass = document.getElementsByClassName("function-dropdown")[0];
  functionClass.classList.toggle("show");
}

// Function to apply a formula and bind calculation to the active cell
function applyFormula(formulaType, e) {
  const formulaText = `=${formulaType}()`;
  activeCell.innerText = formulaText;
  activeCell.addEventListener("keydown", (e) => calculateFormula(formulaType, e));
}

// Generalized function to handle all formulas
function calculateFormula(formulaType, e) {
  if (e.keyCode === 13) {
    const formula = e.target.innerText;
    const rangeMatch = formula.match(/\(([^)]+)\)/); // Extract range from formula

    if (!rangeMatch) return; // Exit if no range is found

    const range = rangeMatch[1];
    const ranges = range.split(":").join(",").split(","); // Split the ranges and cells
    let result = formulaType === "COUNT" ? 0 : formulaType === "MAX" ? -Infinity : formulaType === "MIN" ? Infinity : 0;
    let count = 0;

    ranges.forEach((cellRange) => {
      const cellText = cellRange.match(/[a-zA-Z]+\d+/g);

      if (cellText && cellText.length > 0) {
        const { startRow, startCol, endRow, endCol } = parseRange(cellText[0], cellText[1] || cellText[0]);

        for (let row = startRow; row <= endRow; row++) {
          for (let col = startCol; col <= endCol; col++) {
            const cell = data[currentSheetIndex - 1][row][col];
            const cellValue = parseFloat(cell.innerText) || 0;

            // Logic for different formulas
            if (formulaType === "SUM") {
              result += cellValue;
            } else if (formulaType === "AVERAGE") {
              result += cellValue;
              count++;
            } else if (formulaType === "COUNT") {
              if (cell.innerText !== "") count++;
            } else if (formulaType === "MAX") {
              result = Math.max(result, cellValue);
            } else if (formulaType === "MIN") {
              result = Math.min(result, cellValue);
            }
          }
        }
      }
    });

    // For AVERAGE, divide by the number of non-empty cells
    if (formulaType === "AVERAGE" && count > 0) {
      result = Math.floor(result / count);
    }

    activeCell.innerText = result === -Infinity || result === Infinity ? 0 : result;
    activeCell.removeEventListener("keydown", (e) => calculateFormula(formulaType, e));
  }
}

// Function to parse cell range into row and column indices
function parseRange(startCell, endCell) {
  const startRow = parseInt(startCell.slice(1)) - 1; // Row is 1-based, so we subtract 1
  const endRow = parseInt(endCell.slice(1)) - 1;

  const startCol = startCell.charCodeAt(0) - "A".charCodeAt(0); // Convert column letter to index
  const endCol = endCell.charCodeAt(0) - "A".charCodeAt(0);

  return { startRow, startCol, endRow, endCol };
}

// Add a listener to detect manual entry of formulas
function detectManualFormula(e) {
  if (e.keyCode === 13) {
    const formula = e.target.innerText;
    const match = formula.match(/^=(SUM|AVERAGE|COUNT|MAX|MIN)\(([^)]+)\)$/i);

    if (match) {
      const formulaType = match[1].toUpperCase();
      calculateFormula(formulaType, e);
    }
  }
}

// Attach the listener for manual formula entry
document.addEventListener("keydown", (e) => {
  if (activeCell && e.target === activeCell) {
    detectManualFormula(e);
  }
});

// Apply the SUM formula when the user clicks on SUM from the dropdown
function functionSum(e) {
  applyFormula("SUM", e);
}

// Apply the AVERAGE formula when the user clicks on AVERAGE from the dropdown
function functionAverage(e) {
  applyFormula("AVERAGE", e);
}

// Apply the COUNT formula when the user clicks on COUNT from the dropdown
function functionCount(e) {
  applyFormula("COUNT", e);
}

// Apply the MAX formula when the user clicks on MAX from the dropdown
function functionMax(e) {
  applyFormula("MAX", e);
}

// Apply the MIN formula when the user clicks on MIN from the dropdown
function functionMin(e) {
  applyFormula("MIN", e);
}

// You can add other formula functions in a similar manner if needed.
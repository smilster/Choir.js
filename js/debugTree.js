// --- Configuration ---
/**
 * The maximum recursion depth for tree generation.
 * The root object is depth 0. Its children are depth 1, and so on.
 * Depth limit check happens BEFORE processing the current object.
 */


// --- Core Tree Logic ---

/**
 * Recursively generates an HTML string representation of an object or array,
 * respecting the global DEPTH limit.
 *
 * @param {any} obj The object or value to inspect.
 * @param {number} currentDepth The current recursion level (default 0).
 * @returns {string} The HTML string for the object's tree structure.
 */
function createTreeText(obj, currentDepth = 0) {
    // Handle primitives (null, string, number, boolean, undefined)
    if (obj === null || typeof obj !== 'object') {
        let valueText = String(obj);

        if (obj === null) valueText = 'null';
        else if (typeof obj === 'string') {
            // String truncation remains, but class is removed
            valueText = `"${valueText.substring(0, 80)}${valueText.length > 80 ? '...' : ''}"`;
        }
        else if (typeof obj === 'undefined') {
            valueText = 'undefined';
        }

        // Use <i> for simple visual distinction of primitives
        return `<i>${valueText}</i>`;
    }

    // Check for maximum depth
    if (currentDepth >= DEPTH) {
        // Use <div> and <i> for plain formatting
        return `<div><i>... Max Depth (${DEPTH}) Reached ...</i></div>`;
    }

    const isArray = Array.isArray(obj);
    const entries = Object.entries(obj);
    const lines = [];

    // Container for children, adding basic inline style for indentation
    lines.push('<div style="margin-left: 20px; border-left: 1px dotted #aaa; padding-left: 5px;">');

    // Iterate over properties
    for (const [key, value] of entries) {
        const valueType = typeof value;
        let valueRepresentation = '';
        let childrenHtml = '';
        let valueDisplay = '';

        if (valueType === 'object' && value !== null) {
            // It's a nested object or array, so recurse
            const isChildArray = Array.isArray(value);
            valueDisplay = isChildArray ? `Array[${value.length}]` : `Object`;

            // Recursive call for the child's structure
            childrenHtml = createTreeText(value, currentDepth + 1);
            // Use <b> for object/array labels
            valueRepresentation = `<b>${valueDisplay}</b>`;

        } else if (valueType === 'function') {
            // Use <i> for function label
            valueRepresentation = `<i>function() { ... }</i>`;
        } else {
            // It's a primitive
            valueRepresentation = createTreeText(value, currentDepth + 1);
        }

        // Use <b> for property keys
        const keyDisplay = `<b>${isArray ? '' : key + ':'}</b>`;

        // Add the line for the current property
        lines.push(`
                    <div>
                        ${keyDisplay}
                        <span>${valueRepresentation}</span>
                        ${childrenHtml}
                    </div>
                `);
    }

    lines.push('</div>'); // Close the nested structure

    // If it's the root call (depth 0), wrap the content with a header
    if (currentDepth === 0) {
        const rootType = isArray ? `Array[${obj.length}]` : 'Object';
        // Use <h2> for a clear header
        return `
                    <h2 style="font-size: 1.2em; margin-bottom: 0.5em;">Root: ${rootType} (Max Depth: ${DEPTH})</h2>
                    ${lines.join('')}
                `;
    }

    return lines.join('');
}

// --- Outer Function Provided by User ---

/**
 * Populates the container's innerHTML with the generated tree text.
 * @param {HTMLElement} container The DOM element to render the tree into.
 * @param {object} obj The object to visualize.
 */
function createTree(container, obj) {
    if (container) {
        container.innerHTML = createTreeText(obj);
    }
}

// --- Example Usage ---

// 1. Example Data (Demonstrates various types and depth limit)
const sampleData = {
    name: "Project Alpha",
    version: 1.2,
    details: { // Depth 1
        owner: "Jane Doe",
        date: new Date().toISOString(),
        config: { // Depth 2
            enabled: true,
            maxItems: 100,
            settings: { // Depth 3 (Content will be truncated)
                theme: "dark",
                sort: "asc",
                cache: { // Depth 4 (will be skipped by depth check)
                    size: 50,
                    expiration: '1h'
                }
            }
        },
        users: [ // Depth 2
            { id: 1, name: "Alice" }, // Depth 3 (Content will be truncated)
            { id: 2, name: "Bob" } // Depth 3 (Content will be truncated)
        ]
    },
    process: function() { console.log('running'); },
    isPublic: true,
    emptyObject: {},
    emptyArray: [],
    bigText: "This is a very long text string that will demonstrate how the string truncation works inside the tree visualization. It should cut off after a certain number of characters to keep the output clean and readable.",
    isNull: null,
    isUndefined: undefined
};

// 2. Run the function on the target container

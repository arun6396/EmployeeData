let employeeData = [];

async function loadEmployeeData(filepath) {
    try {
        const response = await fetch(filepath);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const text = await response.text();
        const data = text.split('\n').map(row => row.split(','));

        const headers = data[0].map(header => header.trim()); 
        for (let i = 1; i < data.length; i++) {
            const row = data[i].map(cell => cell.trim()); 
            if (row.length === headers.length && row[0]) { 
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = row[index];
                });
                employeeData.push(obj);
            }
        }
        console.log('Employee data loaded');
    } catch (error) {
        console.error('Error loading employee data:', error);
    }
}

function createCollection(p_collection_name) {
    console.log(`Collection ${p_collection_name} created`);
}

function indexData(p_exclude_column) {
    if (p_exclude_column) {
        employeeData = employeeData.map(emp => {
            const { [p_exclude_column]: _, ...rest } = emp; 
            return rest;
        });
        console.log('Employee data indexed, excluding:', p_exclude_column);
    }
}

function searchByColumn(p_column_name, p_column_value) {
    return employeeData.filter(emp => emp[p_column_name] === p_column_value);
}

function getEmpCount() {
    return employeeData.length;
}

function delEmpById(p_employee_id) {
    const initialCount = employeeData.length;
    employeeData = employeeData.filter(emp => emp.employee_id !== String(p_employee_id)); 
    return employeeData.length < initialCount;
}

function getDepFacet() {
    return employeeData.reduce((acc, emp) => {
        const dept = emp.department;
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
    }, {});
}


(async () => {
    await loadEmployeeData('Employee Sample Data 1.csv'); 
    createCollection('employees');
    indexData('unnecessary_column'); 

    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; 

   
    const hrResults = searchByColumn('department', 'HR');
    outputDiv.innerHTML += `<p>Search HR Department: ${hrResults.length > 0 ? JSON.stringify(hrResults) : 'No results found'}</p>`;
    
   
    outputDiv.innerHTML += `<p>Employee Count: ${getEmpCount()}</p>`;
    
   
    const deleteResult = delEmpById(12345);
    outputDiv.innerHTML += `<p>Delete Employee ID 12345: ${deleteResult ? 'Deleted successfully' : 'Not found'}</p>`;
    
   
    outputDiv.innerHTML += `<p>Department Facet: ${JSON.stringify(getDepFacet())}</p>`;
})();


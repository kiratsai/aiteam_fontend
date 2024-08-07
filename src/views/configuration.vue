<script setup>
import { ref, onMounted } from 'vue';

const rows = ref([{ name: '', parameter: '' }]);
const allParameters = ref(null);

const add = () => {
  rows.value.push({ name: '', parameter: '' });
  logIndexesAndKeys();
};

const deleteLast = () => {
  if (rows.value.length > 1) {
    rows.value.pop();
    logIndexesAndKeys();
  } else {
    console.warn('At least one row is required.');
  }
};

const logIndexesAndKeys = () => {
  rows.value.forEach((row, index) => {
    console.log(`Row ${index}:`, row);
    console.log(`Index: ${index}, Key: ${index}`);
  });
};

const submitForm = async () => {
  const response = await fetch('/api/config', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(rows.value)
  });
  const json = await response.json();
  console.log(json);
  alert(JSON.stringify(json));
   get_all();
};

// const get_all = async () => {
//   try {
//     const response = await fetch('/api/config/get_all');
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();
//     console.log('Alldata:', data);
//     allParameters.value = data;
//     populateTable(data);
//   } catch (error) {
//     console.error("Error fetching all parameters:", error);
//   }
// };

const get_all = async () => {
    try {
    const response = await fetch('/api/config/get_all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('All parameters:', data);

    allParameters.value = data;
    populateTable(data);
  } catch (error) {
    console.error("Error fetching all parameters:", error);
    alert("Failed to fetch parameters. Please try again.");
  }
};

const cleanAllParameters = async () => {
  try {
    const response = await fetch('/api/config/clean', { method: 'POST' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log(result.message);
    rows.value = [{ name: '', parameter: '' }];
    allParameters.value = null;
    alert("All parameters have been cleared.");
  } catch (error) {
    console.error("Error cleaning parameters:", error);
    alert("Failed to clean parameters. Please try again.");
  }
};

const populateTable = (data) => {
  if (Array.isArray(data)) {
    rows.value = data.map(item => ({
      name: item.name || '',
      parameter: item.parameter || ''
    }));
  } else if (typeof data === 'object' && data !== null) {
    rows.value = Object.entries(data).map(([name, parameter]) => ({
      name,
      parameter: parameter.toString()
    }));
  } else {
    console.error('Unexpected data format:', data);
    rows.value = [{ name: '', parameter: '' }];
  }
};

const deleteParameter = async (name) => {
  try {
    const response = await fetch(`/api/config/clean/${encodeURIComponent(name)}`, { 
      method: 'POST'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log(result.message);
    alert(`Parameter "${name}" has been deleted.`);
    get_all(); 
  } catch (error) {
    console.error("Error deleting parameter:", error);
    alert(`Failed to delete parameter "${name}". Please try again.`);
  }
};

onMounted(async () => {
        get_all();
});

</script>

<template>
  <div class="d-flex">
  <div class="container mt-4">
    <form @submit.prevent="submitForm">
      <table class="table">
        <thead>
          <tr>
            <th class="text-center">Name</th>
            <th class="text-center">Parameter</th>
          </tr>
        </thead>
        <tbody id="add_parameter">
          <tr v-for="(row, index) in rows" :key="index">
            <td class="px-2">
              <input type="text" class="form-control" v-model="row.name" required />
            </td>
            <td class="px-2">
              <input type="text" class="form-control" v-model="row.parameter" required />
            </td>
          </tr>
        </tbody>
      </table>
      <div class="d-flex justify-content-around mb-3">
        <a class="link-primary" @click="add">add +</a>
        <a class="link-danger" @click="deleteLast">delete</a>
      </div>
      <div class="mb-3">
        <button type="submit" class="btn btn-primary me-2">Submit</button>
        <button type="button" class="btn btn-primary me-2" @click="get_all">Get All</button>
        <button type="button" class="btn btn-danger" @click="cleanAllParameters">Clean All Parameters</button>
      </div>
    </form>

    <h3 class="mt-4">All Parameters</h3>
    <table v-if="allParameters" class="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Parameter</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(parameter, name) in allParameters" :key="name">
          <td>{{ name }}</td>
          <td>{{ parameter }}</td>
          <td>
            <button @click="deleteParameter(name)" class="btn btn-danger btn-sm">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>No parameters to display.</p>
  </div>
  </div>
</template>
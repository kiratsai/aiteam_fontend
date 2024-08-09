<template>
  <div id="app" class="container mt-4" style="padding-left: 110px;">
    <h1 class="mb-4">Navigation Management</h1>

    <form @submit.prevent="submitForm">
      <div class="row mb-3">
        <div class="col">
          <input type="text" class="form-control" v-model="navigation.name" @input="getName(value)" placeholder="Name"
            required>
        </div>
        <div class="col">
          <input type="number" class="form-control" v-model="navigation.id" placeholder="ID" required>
        </div>
        <div class="col">
          <input type="text" class="form-control" v-model="navigation.x" placeholder="X" required>
        </div>
        <div class="col">
          <input type="text" class="form-control" v-model="navigation.y" placeholder="Y" required>
        </div>
        <div class="col">
          <input type="text" class="form-control" v-model="navigation.z" placeholder="Z" required>
        </div>
      </div>
      <div class="mb-3">
        <button type="submit" class="btn btn-primary me-2">Submit</button>
        <button type="button" class="btn btn-secondary me-2" @click="getAllNavigation">Get All Navigation</button>
        <button type="button" class="btn btn-danger me-2" @click="clearAllNavigation">Clear All Navigation</button>
        <button type="button" class="btn btn-primary me-2" @click="startPy">Start navigation Python</button>
        <button type="button" class="btn btn-warning me-2" @click="stopPy">Stop navigation Python</button>
      </div>
    </form>

    <h2 class="mt-4">All Navigation Data</h2>
    <div v-for="(tableData, tableName) in groupedNavigationData" :key="tableName" class="mb-4">
      <button @click="clearNavigationTable(tableName)" class="btn btn-warning btn-sm">Delete table</button>
      <h3>{{ tableName }}</h3>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>X</th>
            <th>Y</th>
            <th>Z</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.x }}</td>
            <td>{{ item.y }}</td>
            <td>{{ item.z }}</td>
            <td>
              <button @click="clearANavigation(tableName, item.id)" class="btn btn-warning btn-sm">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';

export default {
  name: 'NavigationManagement',
  setup() {
    const navigation = ref({ name: '', id: '', x: '', y: '', z: '' });
    const allNavigationData = ref({});
    let eventSource = null;


    const groupedNavigationData = computed(() => {
      const grouped = {};
      for (const [key, value] of Object.entries(allNavigationData.value)) {
        const [name, id] = JSON.parse(key);
        const [x, y, z] = JSON.parse(value);
        if (!grouped[name]) {
          grouped[name] = [];
        }
        grouped[name].push({ id, x, y, z });
      }

      // Sort each group by ID
      for (const name in grouped) {
        grouped[name].sort((a, b) => {
          // Assuming ID is a string that can be converted to a number
          return parseInt(a.id) - parseInt(b.id);
        });
      }

      return grouped;
    });


    const submitForm = async () => {
      try {
        const response = await fetch('/api/navigation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(navigation.value)
        });
        const result = await response.json();
        console.log(result);
        await getAllNavigation();
        alert('Navigation data submitted successfully \n' + result);

        const IdPlus = parseInt(navigation.value.id);
        navigation.value.id = (IdPlus + 1).toString();

        
      } catch (error) {
        console.error("Error submitting form:", error);
        alert('Error submitting navigation data');
      }
    };

    const getAllNavigation = async () => {
      try {
        const response = await fetch('/api/navigation/getAllNavigation');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log("All navigation data:", data);
        allNavigationData.value = data;
      } catch (error) {
        console.error("Error fetching navigation data:", error);
        alert('Error fetching navigation data');
      }
    };

    const clearAllNavigation = async () => {
      try {
        const response = await fetch('/api/navigation/cleanAllNavigation', { method: 'POST' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        console.log(result.message);
        alert("All navigation data has been cleared.");
        getAllNavigation();
      } catch (error) {
        console.error("Error clearing all navigation:", error);
        alert('Error clearing all navigation data');
      }
    };

    const clearANavigation = async (name, id) => {
      try {
        const response = await fetch(`/api/navigation/cleanANavigation/${name}/${id}`, { method: 'POST' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        console.log(result);
        alert(`Navigation for ${name} with ID ${id} has been cleared.`);
        getAllNavigation();
      } catch (error) {
        console.error("Error clearing specific navigation:", error);
        alert('Error clearing specific navigation');
      }
    };

    const clearNavigationTable = async (name) => {
      try {
        const response = await fetch(`/api/navigation/cleanNavigation/${name}`, { method: 'POST' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        console.log(result);
        alert(`Navigation table for ${name} has been cleared.`);
        getAllNavigation();
      } catch (error) {
        console.error("Error clearing specific table navigation:", error);
        alert('Error clearing specific table navigation');
      }
    };

    const getName = async () => {
      console.log("Name entered:", navigation.value.name);
      const name = navigation.value.name
      // console.log("Grouped data:", groupedNavigationData.value);

      if (groupedNavigationData.value[name]) {
        console.log("data:", groupedNavigationData.value[name]);

        // method one count length + 1
        const datalength = groupedNavigationData.value[name].map(item => item.id).length;
        console.log("data length:", datalength + 1);

        // method tow count Math.max number
        const maxId = Math.max(...groupedNavigationData.value[name].map(item => parseInt(item.id)));
        navigation.value.id = (maxId + 1).toString();

      } else {
        console.log("No existing data for this name");
        // If no existing data, start with ID 1
        navigation.value.id = "1";
      }
    }

    const startPy = () => {
      if (eventSource) {
        eventSource.close();
      }
      eventSource = new EventSource('/api/python/stream-data/start');
      eventSource.addEventListener('streaming', (event) => {
        try {
          const jsonData = JSON.parse(event.data);
          console.log('Received data:', jsonData);

          navigation.value.x = jsonData.x || '';
          navigation.value.y = jsonData.y || '';
          navigation.value.z = jsonData.z || '';

          console.log('Updated navigation:', navigation.value);
        } catch (error) {
          console.error('Error parsing or processing JSON:', error);
          console.log('Raw event data:', event.data);
        }
      });
    };

    const stopPy = async () => {
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
      try {
        const response = await fetch('/api/python/stream-data/stop');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.text();
        console.log(result);
        alert('Python script stopped successfully');
      } catch (error) {
        console.error("Error stopping Python script:", error);
        alert('Error stopping Python script');
      }
    };

    onMounted(() => {
      getAllNavigation();
    });

    onUnmounted(() => {
      if (eventSource) {
        eventSource.close();
      }
    });

    return {
      navigation,
      groupedNavigationData,
      submitForm,
      getAllNavigation,
      clearAllNavigation,
      clearANavigation,
      clearNavigationTable,
      getName,
      startPy,
      stopPy,
    };
  }
};
</script>


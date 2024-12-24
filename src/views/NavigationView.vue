<template>
  <div id="app" class="container mt-4" style="padding-left: 110px;">
    <h1 class="mb-4">Floor Plan</h1>
    
    <div class="image-container" style="position: relative;">
      <canvas 
      ref="canvas"
      style="display: none;"
    ></canvas>
    <img 
      ref="floorPlan"
      src="../image/GUI.jpg" 
      style="cursor: crosshair"
      @click="handleClick"
      @mousemove="updateCoordinates"
      @mouseleave="resetCoordinates"
      @load="initializeCanvas"
    >
        <!-- Points -->
        <div 
          v-for="label in labels" 
          :key="label.id"
          class="coordinate-label"
          :style="{
            position: 'absolute',
            left: label.x + 'px',
            top: label.y + 'px',
            background: '#ff0000',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '50%',
            fontSize: '12px',
            transform: 'translate(-50%, -50%)'
          }"
        >
          {{ label.id }}
        </div>
        <!-- Lines connecting points -->
        <svg style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
          <line
            v-for="(line, index) in lines"
            :key="index"
            :x1="line.x1"
            :y1="line.y1"
            :x2="line.x2"
            :y2="line.y2"
            stroke="blue"
            stroke-width="2"
          />
          <!-- Angle labels -->
          <text
            v-for="angle in angles"
            :key="angle.id"
            :x="angle.x"
            :y="angle.y"
            fill="green"
            font-size="12"
          >
            {{ angle.value }}°
          </text>
        </svg>
      </div>
      <div>X: {{ coordinates.x }}, Y: {{ coordinates.y }}</div>

  
    <h1 class="mb-4">Navigation Management</h1>
    <form @submit.prevent="submitForm">
      <div class="row mb-3">
        <div class="col">
          <input type="text" class="form-control" v-model="navigation.name" @input="getName(value)" placeholder="Name"
            required>
        </div>
        <div class="col">
          <input type="number" class="form-control" v-model="navigation.id" @input="getId(value)" placeholder="ID" required>
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
        <button type="button" class="btn btn-secondary me-2" @click="updateNavigation"> update Navigation </button>
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
    const coordinates = ref({ x: 0, y: 0 });
    const labels = ref([]);
    const lines = ref([]);
    const angles = ref([]);
    let labelCounter = 1;
    const canvas = ref(null);
    const floorPlan = ref(null);
    const ctx = ref(null);

    const initializeCanvas = () => {
      const img = floorPlan.value;
      const canvasEl = canvas.value;
      
      canvasEl.width = img.naturalWidth;
      canvasEl.height = img.naturalHeight;
      
      ctx.value = canvasEl.getContext('2d');
      ctx.value.drawImage(img, 0, 0);
    };

    const isWhitePixel = (x, y) => {
      if (!ctx.value) return false;
      
      const pixel = ctx.value.getImageData(x, y, 1, 1).data;
      // Check if pixel is close to white (allowing some tolerance)
      const tolerance = 200; // Adjust this value as needed
      return pixel[0] >= tolerance && pixel[1] >= tolerance && pixel[2] >= tolerance;
    };

    const handleClick = (event) => {
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Scale coordinates to match original image dimensions
      const scaleX = floorPlan.value.naturalWidth / rect.width;
      const scaleY = floorPlan.value.naturalHeight / rect.height;
      const originalX = Math.round(x * scaleX);
      const originalY = Math.round(y * scaleY);

      if (isWhitePixel(originalX, originalY)) {
        addLabel(event);
      }
    };

    const calculateAngle = (x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    // Calculate angle from positive y-axis (12 o'clock)
    let angle = Math.atan2(dx, -dy) * (180 / Math.PI);
    // Normalize angle to 0-360 degrees
    angle = (angle + 360) % 360;
    return Math.round(angle);
};

    const calculateDistance = (x1, y1, x2, y2) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      return Math.round(Math.sqrt(dx * dx + dy * dy));
    };

  const addLabel = (event) => {
  const rect = event.target.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  // Store the current point
  labels.value.push({
    id: labelCounter++,
    x: x,
    y: y,
  });

  // If there's a previous point, use its coordinates for the input boxes
  if (labels.value.length >= 2) {
    const prevPoint = labels.value[labels.value.length - 2];
    navigation.value.x = Math.round(prevPoint.x).toString();
    navigation.value.y = Math.round(prevPoint.y).toString();

    // Calculate and update line
    const currentPoint = labels.value[labels.value.length - 1];
    lines.value.push({
      x1: prevPoint.x,
      y1: prevPoint.y,
      x2: currentPoint.x,
      y2: currentPoint.y
    });

    // Calculate angle and update z value
    const angle = calculateAngle(prevPoint.x, prevPoint.y, currentPoint.x, currentPoint.y);
    const distance = calculateDistance(prevPoint.x, prevPoint.y, currentPoint.x, currentPoint.y);
    
    navigation.value.z = angle.toString();

    angles.value.push({
      id: angles.value.length + 1,
      fromPoint: prevPoint.id,
      toPoint: currentPoint.id,
      value: angle,
      distance: distance,
      x: (prevPoint.x + currentPoint.x) / 2,
      y: (prevPoint.y + currentPoint.y) / 2 - 10
    });
  } else {
    // For the first point, use its own coordinates
    navigation.value.x = Math.round(x).toString();
    navigation.value.y = Math.round(y).toString();
    navigation.value.z = '0';
  }
};
      // Add the coordinates methods
   const updateCoordinates = (event) => {
      const rect = event.target.getBoundingClientRect();
      coordinates.value = {
        x: Math.round(event.clientX - rect.left),
        y: Math.round(event.clientY - rect.top)
      };
    };

    const resetCoordinates = () => {
      coordinates.value = {
        x: 0,
        y: 0
      }
    };


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


    const submitForm = () => {
  const name = navigation.value.name;
  const id = navigation.value.id;

  console.log("Submitting form for name:", name, "and id:", id);

  if (groupedNavigationData.value[name]) {
    console.log("Table found. Searching for item with id:", id);
    const existingItem = groupedNavigationData.value[name].find(item => item.id === id.toString());
    
    if (existingItem) {
      console.log("Item exists:", existingItem);
      alert("Item already exists!");
    } else {
      console.log("Item does not exist. Submitting...");
      submit();
    }
  } else {
    console.log("Table does not exist. Submitting...");
    submit();
  }
};
    const submit = async () => {
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
    }

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

    const getId = async () => {
      console.log("Name entered id:", navigation.value.id);
    }

    const getName = async () => {
      console.log("Name entered name:", navigation.value.name);
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

    const updateNavigation = async () => {
      const name = navigation.value.name;
      const id = navigation.value.id;

      if (groupedNavigationData.value[name]) {
        const existingItem = groupedNavigationData.value[name].find(item => item.id === id);

        if (existingItem) {
          console.log("Item exists. Updating...");
          clearANavigation(name, id);
          submitForm();
          // try {
          //   const response = await fetch('/api/navigation', {
          //     method: 'PUT',
          //     headers: { 'Content-Type': 'application/json' },
          //     body: JSON.stringify(navigation.value)
          //   });

          //   if (!response.ok) {
          //     throw new Error(`HTTP error! status: ${response.status}`);
          //   }

          //   const result = await response.json();
          //   console.log("Update result:", result);
          //   alert('Navigation data updated successfully');
          //   await getAllNavigation();
          // } catch (error) {
          //   console.error("Error updating navigation:", error);
          //   alert('Error updating navigation data');
          // }
        } else {
          console.log("Item with this ID does not exist in this table");
          alert('No item found with this ID in the specified table');
        }
      } else {
        console.log("Table does not exist");
        alert('No table found with this name');
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
      canvas,
      floorPlan,
      handleClick,
      initializeCanvas,
      navigation,
      coordinates,
      labels,
      lines,
      angles,
      groupedNavigationData,
      updateCoordinates,
      resetCoordinates,
      addLabel,
      submitForm,
      submit,
      getAllNavigation,
      clearAllNavigation,
      clearANavigation,
      clearNavigationTable,
      getName,
      startPy,
      stopPy,
      updateNavigation,
      getId
    };
  }
};
</script>


<style scoped>
.image-container {
  position: relative;
  display: inline-block;
}

.coordinate-label {
  position: absolute;
  user-select: none;
  pointer-events: none;
}
</style>
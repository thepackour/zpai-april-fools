<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
  background-color: black;
  color: white;
  font-family: 'Courier New', monospace;
  font-size: 16px;
}

@media only screen and (max-width: 768px) {
  html, body {
    font-size: 12px;
    padding: 4px;
  }
  .terminal {
    padding: 0px 0px;
  }
}

</style>

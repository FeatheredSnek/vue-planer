<template>

  <header>
    <div class="header-wrap">
      <div class="header-left"><strong>vue</strong>Planer</div>
      <div class="header-right">
        <button @click="this.loadButtonEnabled ? loadRandomClasses() : ''">Load some random classes</button>
        <button >Code on Github</button>
      </div>
    </div>
  </header>

  <div class="components-wrap">
      <ClassList />
      <Timetable />
  </div>

  <div>
    <ClassDetails />
  </div>

</template>

<script>
import ClassList from './components/ClassList.vue'
import Timetable from './components/Timetable.vue'
import ClassDetails from './components/ClassDetails.vue'

export default {
  name: 'App',
  components: {
    ClassList,
    Timetable,
    ClassDetails
  },
  methods: {
    loadRandomClasses() {
      this.loadButtonEnabled = false
      this.$store.commit('clearClassDatabase')
      this.$store.dispatch('getClassesFromApi')
      setTimeout(() => {this.loadButtonEnabled = true}, 1000)
    }
  },
  created() {
    this.loadButtonEnabled = false
    this.loadRandomClasses()
  }
}
</script>

<style>
header {
  width: 100%;
  height: 4rem;
  color: white;
  background-color: #425C81;
}
.header-wrap {
  height: 100%;
  width: 100%;
  max-width: 1400px;
  min-width: 1200px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin: auto;
  justify-content: space-between;
  align-items: center;
}
.header-left {
  font-size: 2rem;
}
.header-right {
}
.header-right > button {
  font-weight: 300;
  height: 2.5rem;
  border: 1px solid white;
  font-size: 0.8rem;
  color: white;
  background-color: #425C81;
  padding: 0 1rem;
  margin: 0 .5rem;
  transition: background-color 0.2s;
}
.header-right > button:hover {
  color: #425C81;
  background-color: white;
}
.components-wrap {
  max-width: 1400px;
  min-width: 1200px;
  margin: auto;
  padding: 0;
  display: flex;
}
</style>

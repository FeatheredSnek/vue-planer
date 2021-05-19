<template>

  <header>
    <div class="header-wrap">
      <div class="header-left"><strong>vue</strong>Planer</div>
      <div class="header-right">
        <a class="header-button" @click="this.loadButtonEnabled ? loadRandomClasses() : ''">
          Load some random classes
        </a>
        <a class="header-button" href="https://github.com/FeatheredSnek/vue-planer" target="_blank">
          Code on GitHub
        </a>
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
  background-color: #425C81;
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
  padding-left: 0.5rem;
}
.header-right {
  padding-right: 0.5rem;
}
.header-button {
  display: inline-block;
  font-weight: 300;
  height: 2.5rem;
  border: 1px solid white;
  font-size: 0.8rem;
  color: white;
  background-color: #425C81;
  padding: 0 1rem;
  margin: 0 .5rem;
  transition: background-color 0.2s;
  cursor:pointer;
  text-decoration:none;
  font-size: 0.9rem;
  line-height: 2.3rem;
  vertical-align: middle;
}
.header-button:hover {
  color: #425C81;
  background-color: white;
}
.components-wrap {
  max-width: 1400px;
  min-width: 1200px;
  box-sizing: border-box;
  padding: 0 0.5rem;
  margin: auto;
  display: flex;
}
</style>

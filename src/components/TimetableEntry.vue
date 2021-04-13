<template>
  <div class="timetable-entry" :class="isHighlighted ? 'entry-highlighted' : 'entry-regular'" @mouseover="highlightInTimetable(this.id)" @mouseout="highlightInTimetable(null)">
    <h5>{{ name }}</h5>
    <div class="entry-buttons">
      <button @click="openDetails(id)"><img src="../assets/icon-info.svg" /></button>
      <button @click="deselectClass(id)"><img src="../assets/icon-remove.svg" /></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimetableEntry',
  props: {
    id: Number,
    name: String,
    category: String,
  },
  methods: {
    openDetails(classId) {
      this.$store.commit('updateDetails',
      {
        id: classId
      })
    },
    deselectClass(classId) {
      this.$store.commit('deselectClass', {
        id: classId
      })
    },
    highlightInTimetable(classId) {
      this.$store.commit('updateHighlight',
      {
        id: classId
      })
    }
  },
  computed: {
    isHighlighted() {
      return (this.$store.state.timetableHighlightId === this.id ? true : false)
    }
  },
}
</script>

<style>
h5 {
  font-size: 0.8rem;
  margin: 0 0 0.5rem 0;
}
.timetable-entry {
  box-sizing: border-box;
  margin: 2px;
  z-index: 2;
  text-align: center;
  background: #D8E3E9;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
}
.entry-buttons > button {
  background-color: inherit;
  border-color: #425C81;
  width: 1.5rem;
  height: 1.5rem;
  margin: 0 0.2rem 0 0;
  padding: 0;
}
.entry-buttons > button:hover {
  background-color: #A5D4DE;
}
.entry-buttons > button > img {
  margin-top:4px;
  width:0.6rem;
}
.entry-regular {
    outline: none;
}
.entry-highlighted {
    outline: 1px solid #425C81;
}
</style>

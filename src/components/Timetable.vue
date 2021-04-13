<template>
<div class="timetable-wrap">
  <div class="labels-days">
    <p>Monday</p>
    <p>Tuesday</p>
    <p>Wednesday</p>
    <p>Thursday</p>
    <p>Friday</p>
  </div>
  <div class="labels-hours">
    <p>9:00</p>
    <p>10:00</p>
    <p>11:00</p>
    <p>12:00</p>
    <p>13:00</p>
    <p>14:00</p>
    <p>15:00</p>
  </div>
  <div class="timetable_grid">
    <transition-group name="entry-fade">
      <TimetableEntry
        v-for="c in selectedClasses"
        :key="c.id"
        :id="c.id"
        :name="c.name"
        :category="c.category"
        :style="gridPlacementStyle(c.day, c.starts, c.duration)"
      />
    </transition-group>
    <TimetablePreview
      v-show="previewedClass.id > 0"
      :style="gridPlacementStyle(previewedClass.day, previewedClass.starts, previewedClass.duration)"
      :id="previewedClass.id"
      :starts="previewedClass.starts"
      :duration="previewedClass.duration"
    />
  </div>
</div>
</template>

<script>
import TimetableEntry from './TimetableEntry.vue'
import TimetablePreview from './TimetablePreview.vue'

export default {
  name: 'Timetable',
  components: {
    TimetableEntry,
    TimetablePreview
  },
  props: {

  },
  computed: {
    selectedClasses() {
      return this.$store.getters.getSelectedClasses
    },
    previewedClass() {
      let previewId = this.$store.state.timetablePreviewId
      if (previewId != null) {
        return this.$store.getters.getClassById(previewId)
      }
      else {
        return {
          id: -1,
          day: 0,
          starts: 8,
          duration: 0
        }
      }
    },

  },
  methods: {
    gridPlacementStyle(day, starts, duration) {
      let computedDay = day
      let computedStart = ((starts - 8) * 4) + 1
      let computedDuration = Math.floor(duration / 0.25)
      let placementStyleObject = {
        'grid-column': computedDay,
        'grid-row': `${computedStart} / span ${computedDuration}`
      }
      return placementStyleObject
    },
  },
}
</script>

<style>
.timetable-wrap {
  display: grid;
  grid-template-columns: 1rem auto;
  grid-template-rows: 1rem auto;
  padding: 1.5rem 0 0 2rem;
  height: calc(100vh - 6rem);
  min-height: 36rem;
  box-sizing: border-box;
  width: calc(100% - 20rem);
  top: 1200px;
  flex-grow: 1;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  align-self: flex-start;
}
.labels-days {
  grid-row-start: 1;
  grid-column-start: 2;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: top;
  width: 100%;
  height: 0.8rem;
  font-size: 0.6rem;
  margin: 0.2rem 0;
}
.labels-days > p {
  margin: 0;
  width: 20%;
  text-align: center;
}
.labels-hours {
  grid-row-start: 2;
  grid-column-start: 1;
  font-size: 0.6rem;
  width: 1rem;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-around;
  box-sizing: border-box;
  padding: 220% 0;
}
.labels-hours-resizer {
}
.labels-hours > p {
  writing-mode:vertical-lr;
  margin: 0;
}
.timetable_grid {
  grid-row-start: 2;
  grid-column-start: 2;
  width: 100%;
  height: 100%;
  margin-right: 1rem;
  display: grid;
  background: url('../assets/grid-bg-cols.svg'), url('../assets/grid-bg-rows.svg');
  background-size: 20% auto, auto 12.5%;
  background-color: white;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows:
    1fr 1fr 1fr 1fr /*  8 */
    1fr 1fr 1fr 1fr /*  9 */
    1fr 1fr 1fr 1fr /* 10 */
    1fr 1fr 1fr 1fr /* 11 */
    1fr 1fr 1fr 1fr /* 12 */
    1fr 1fr 1fr 1fr /* 13 */
    1fr 1fr 1fr 1fr /* 14 */
    1fr 1fr 1fr 1fr /* 15 */;
}
.preview {
  background-color: rgba(255, 255, 255, 0.2);
  opacity: 0.5;
}
.entry-fade-enter-active,
.entry-fade-leave-active {
  transition: opacity 0.2s;
}
.entry-fade-enter-from {
  opacity: 0.5
}
.entry-fade-leave-to {
  opacity: 0;
}

</style>

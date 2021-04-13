<template>
<transition name="modal-fade">
  <div class="modal-wrap" v-if="modalEnabled">
    <div class="modal-content" ref="box" :style="currentHeight ? `height:${currentHeight}px` : 'auto'">
      <div class="modal-header">
        <div class="modal-header-text">
          <h3>{{ classInfo.name }}</h3>
          <h4>{{ classInfo.teacher }}</h4>
          <h5>
            <img class="item-symbol" :src="getCategoryImage(classInfo.category)" />&nbsp;
            {{ classInfo.category }}
            <span v-if="classInfo.mandatory">
              &nbsp;&nbsp;-&nbsp;&nbsp;
              Mandatory for {{ classInfo.mandatory.toString().replaceAll(',',', ') }}
            </span>
            &nbsp;&nbsp;-&nbsp;&nbsp;
            <span>{{ showReadableDate(classInfo.day, classInfo.starts, classInfo.duration) }}</span>
          </h5>
        </div>
        <div class="modal-header-buttons">
          <button v-if="!isSelected" @click="selectClass(classInfo.id)" :disabled="isOverlapping">Add to my timetable</button>
          <button v-else @click="deselectClass(classInfo.id)">Remove from my timetable</button>
          <button @click="closeModal()">✕</button>
        </div>
      </div>
      <div class="modal-description">
        {{ classInfo.description }}
        <transition name="alert-fade" @before-leave="heightTransition()">
          <div class="modal-alert" role="alert" ref="alert" v-if="isOverlapping">
            <span>This class overlaps with other currently selected classes: <span v-for="o in getOverlaps" :key="o.id">{{o.name + ''}}</span>!</span>
            <button @click="removeConflictingClasses(classInfo.id)">Remove conflicting classes</button>
          </div>
        </transition>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
import CategorySymbols from '../scripts/CategorySymbols.js'

export default {
  name: 'ClassDetails',
  data() {
    return {
      currentHeight: undefined,
      alertHeight: 0
    }
  },
  props: {
  },
  computed: {
    modalEnabled() {
      let modal_id = this.$store.state.detailsModalId
      if (modal_id === null) {
        return false
      }
      else {
        return true
      }
    },
    classInfo() {
      return this.$store.getters.getClassById(this.$store.state.detailsModalId)
    },
    getOverlaps() {
      return this.$store.getters.getOverlaps(this.classInfo.id)
    },
    isOverlapping() {
      return (this.getOverlaps.length > 0 ? true : false)
    },
    isSelected() {
      return (this.$store.state.selectedClasses.find(c => c === this.classInfo.id))
    },
  },
  methods: {
    closeModal() {
      this.$store.commit('updateDetails',
      {
        id: null
      })
    },
    selectClass(classId) {
      this.$store.commit('selectClass', {
        id: classId
      })
      this.closeModal()
    },
    deselectClass(classId) {
      this.$store.commit('deselectClass', {
        id: classId
      })
      this.closeModal()
    },
    removeConflictingClasses(classId) {
      this.$data.alertHeight = this.$refs.alert.clientHeight
      let overlapIds = []
      for (let overlap of this.getOverlaps) {
        overlapIds.push(overlap.id)
      }
      this.$store.commit('removeOverlaps', {
        overlapIds
      })
    },
    showReadableDate(day, start, duration) {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      let output = days[day-1] + ', '
      let start_hours = Math.trunc(start)
      let start_minutes = ((start - start_hours) * 60).toString()
      let end_hours = Math.trunc(start+duration)
      let end_minutes = ((start+duration - end_hours) * 60).toString()
      while (start_minutes.length <  2) {start_minutes = '0' + start_minutes}
      while (end_minutes.length <  2) {end_minutes = '0' + end_minutes}
      output += `${start_hours}:${start_minutes}–${end_hours}:${end_minutes}`
      return output
    },
    getCategoryImage(category) {
      return CategorySymbols.getCategorySymbolReverse(category)
    },
    heightTransition() {
      this.$refs.box.clientHeight
      this.$data.currentHeight = this.$refs.box.clientHeight
      setTimeout(() => {this.$data.currentHeight = this.$refs.box.clientHeight - (this.$data.alertHeight+30)}, 200)
      setTimeout(() => {this.$data.currentHeight = undefined}, 400)
    }
  }
}
</script>

<style scoped>
.modal-wrap {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  background: rgba(255,255,255,0.5);
}
.modal-content {
  background-color: white;
  border-style: solid;
  border-width: 2px;
  border-color: #425C81;
  margin: 2rem auto auto auto;
  width: 60%;
  min-width: 800px;
  max-width: 1000px;
  transition: height 0.2s;
}
.modal-header {
  box-sizing: border-box;
  padding: 1.5rem 2rem;
  color: white;
  width: 100%;
  background-color: #425C81;
  display: flex;
  justify-content: space-between;
}
.modal-header-text > h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
}
.modal-header-text > h4 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 300;
}
.modal-header-text > h5 {
  margin: 0.5rem 0 0 0;
  font-size: 0.8rem;
  font-weight: 300;
}
.modal-header-text > h5 > img {
  display: inline-block;
  height: 0.8rem;
  position: relative;
  top: 2px;
}
.modal-header-text {
}
.modal-header-buttons {
  min-width: 14rem;
}
.modal-header-buttons > button {
  text-align: center;
  font-weight: 300;
  height: 2.5rem;
  border: 1px solid white;
  font-size: 0.8rem;
  color: white;
  background-color: #425C81;
  padding: 0 1rem;
  margin: 0 0 0 1rem
}
.modal-header-buttons > button:hover {
  background-color: white;
  color: #425C81;
}
.modal-header-buttons > button:last-child {
  width: 2.5rem;
  padding: 0 0.8rem;
}
.modal-header-buttons > button:disabled {
  opacity: 0.5;
}
.modal-header-buttons > button:disabled:hover {
  background-color: inherit;
  color: white;
}
.modal-description {
  box-sizing: border-box;
  padding: 1.5rem 2rem 2rem 2rem;
  color: #425C81;
  width: 100%;
  background-color: white;
  font-size: 0.8rem;
}
.modal-alert {
  margin-top: 1.5rem;
  font-size: 0.8rem;
  background-color: rgba(224, 97, 129, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  box-sizing: border-box;
}
.modal-alert > span {
  max-width: 25rem;
}
.modal-alert > button {
  text-align: center;
  font-weight: 300;
  height: 2.5rem;
  border-style: solid;
  border-width: 1px;
  border-color: #425C81;
  font-size: 0.7rem;
  color: #425C81;
  background-color: rgba(224, 97, 129, 0.0);
  padding: 0 1rem;
  margin: 0 0 0 1rem
}
.modal-alert > button:hover {
  background-color: rgba(224, 97, 129, 0.2);
}
.modal-fade-enter-active {
  transition: opacity 0.2s;
}
.modal-fade-leave-active {
  transition: opacity 0.3s;
}
.modal-fade-enter-from {
  opacity: 0;
}
.modal-fade-leave-to {
  opacity: 0;
}
.alert-fade-enter-active, .alert-fade-leave-active {
  transition: opacity 0.2s;
}
.alert-fade-enter-from, .alert-fade-leave-to {
  opacity: 0;
}
</style>

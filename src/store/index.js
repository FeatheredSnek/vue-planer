import {createStore} from 'vuex'
import Parser from '../scripts/Parser.js'

export default createStore({
  state: {
    classes_database: [],
    selectedClasses: [],
    timetableHighlightId: null,
    timetablePreviewId: null,
    detailsModalId: null,
    load_error: false
  },
  getters: {
    getSelectedClasses(state) {
      let selected = []
      for (let c of state.classes_database) {
        if (state.selectedClasses.find(i => i == c.id)) {
          selected.push(c)
        }
      }
      return selected
    },
    getClassById: (state) => (id) => {
      let c = state.classes_database.find(el => el.id === id)
      if (c == undefined) {
        return state.classes_database[0]
      }
      else {
        return c
      }
    },
    getOverlaps: (state) => (id) => {
      let selected = []
      for (let c of state.classes_database) {
        if (state.selectedClasses.find(i => i == c.id)) {
          selected.push(c)
        }
      }
      let classToCheck = state.classes_database.find(el => el.id === id)
      let overlaps = []
      if (classToCheck) {
      overlaps = selected.filter(
        function(element) {
          return (
            // dont check yourself, check only the same day
            (element.id != classToCheck.id && element.day == classToCheck.day)
            &&
            // check if class starts after or ends before - if so then discard as nonoverlapping thus !
            !(classToCheck.starts > element.starts+element.duration || classToCheck.starts+classToCheck.duration < element.starts)
            &&
            (
              // check if class starts is before selected ends
              (classToCheck.starts < element.starts+element.duration)
              ||
              // or if class ends before selected starts
              (classToCheck.starts+classToCheck.duration < element.starts)
            )
          )
        }
        )}
      return overlaps
    },
  },
  mutations: {
    selectClass(state, payload) {
      state.selectedClasses.push(payload.id)
      state.timetablePreviewId = null
    },
    deselectClass(state, payload) {
      if (state.selectedClasses.find(c => c == payload.id)) {
        state.selectedClasses.splice(state.selectedClasses.indexOf(payload.id), 1)
      }
      else {
        return
      }
    },
    updatePreview(state, payload) {
      state.timetablePreviewId = payload.id
    },
    updateDetails(state, payload) {
      state.detailsModalId = payload.id
    },
    updateHighlight(state, payload) {
      state.timetableHighlightId = payload.id
    },
    removeOverlaps(state, payload) {
      for (let id of payload.overlapIds) {
        state.selectedClasses.splice(state.selectedClasses.indexOf(id), 1)
      }
    },
    loadClassDatabase(state, payload) {
      let parsed = Parser.parseArray(payload.newclasses)
      state.classes_database = parsed
    },
    clearClassDatabase(state) {
      state.classes_database = []
    },
    setLoadError(state, payload) {
      state.load_error = payload.status
    }
  },
  actions: {
    getClassesFromApi( {commit} ) {
      fetch('http://dorianmaczka.xaa.pl/vue-scheduler/api.php?random_classes')
        .then(response => response.json())
        .then(
          data => {
            if (data.status) {
              let newclasses = data.output;
              commit('setLoadError', { status: false })
              commit('loadClassDatabase', { newclasses });
            }
          }
        )
        .catch(error => {
          console.log(error)
          commit('setLoadError', { status: true })
        }
      )
    }
  },
  modules: {}
})

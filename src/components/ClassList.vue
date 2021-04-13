<template>
<div class="class-list-wrap">

  <div class="controls">
    <label for="filtername">Search:</label>
    <input v-model="find_class" id="filtername" type="text" />
    <p class="sorting-controls">Sort by:
      <span @click="changeSorting('name')" :class="{bolded: sorting == 'name'}">
        Name {{ nameSortingSymbol }}
      </span>
      |
      <span @click="changeSorting('category')" :class="{bolded: sorting == 'category'}">
        Category {{ categorySortingSymbol }}
      </span>
    </p>
  </div>

  <transition name="placeholder-fade" mode="out-in">

    <div v-if="loadError" class="loading-placeholder error">
      Loading error, try again later!
    </div>

    <div v-else-if="classList.length == 0" class="loading-placeholder pending">
      Waiting for classes to load...
    </div>

    <ul v-else class="class-list">
      <li
        v-for="c in classList"
        :key="c.id"
        :class="{ 'item-selected': c.selected }"
        @mouseenter="c.selected ? highlightInTimetable(c.id) : previewInTimetable(c.id)"
        @mouseleave="disablePreview()"
        class="highlightable">
          <img class="item-symbol" :src="getCategoryImage(c.category)" :alt="'Category: ' + c.category "/>
          <div class="item-data">
            <p class="bolded item-name">{{ c.name }}</p>
            <p class="item-teacher">{{ c.teacher }}</p>
          </div>
          <div class="item-buttons">
            <button @click="openDetails(c.id)">
              <img src="../assets/icon-info.svg" />
            </button>
            <button @click="toggleSelection(c.id)" :disabled="c.overlapping">
              <img :src="c.selected ? require('../assets/icon-remove.svg') : require('../assets/icon-add.svg')" />
            </button>
          </div>
      </li>
    </ul>

  </transition>

</div>
</template>

<script>
import CategorySymbols from '../scripts/CategorySymbols.js'

export default {
  name: 'ClassList',
  data() {
    return {
      sorting: 'name',
      sort_direction: 1, //1 for ascending, -1 for descending
      find_class: '',
    }
  },
  props: {

  },
  computed: {
    classList() {
      let simpleClassList = []
      for (let entry of this.$store.state.classes_database) {
        let is_selected = this.$store.state.selectedClasses.find(e => e === entry.id)
        let is_overlapping = (this.$store.getters.getOverlaps(entry.id).length ? true : false)
        let entry_simplified = {
          id: entry.id,
          name: entry.name,
          category: entry.category,
          teacher: entry.teacher,
          selected: is_selected,
          overlapping: is_overlapping
        }
        simpleClassList.push(entry_simplified)
      }
      // sorting
      let dir = this.$data.sort_direction
      let sorting = this.$data.sorting
      simpleClassList.sort(function(a, b) {
        var nameA = a[sorting].toUpperCase();
        var nameB = b[sorting].toUpperCase();
        if (nameA < nameB) {
          return -1 * dir;
        }
        if (nameA > nameB) {
          return 1 * dir;
        }
        return 0;
      })
      // filtering
      let filter = new RegExp(this.$data.find_class, 'i')
      simpleClassList = simpleClassList.filter(el => el.name.match(filter))
      // returning
      return simpleClassList
    },
    selectedIds() {
      return this.$store.state.selectedClasses
    },
    nameSortingSymbol() {
      if (this.$data.sorting == 'name') {
        return (this.$data.sort_direction == 1 ? '▲' : '▼')
      }
      else {
        return '—'
      }
    },
    categorySortingSymbol() {
      if (this.$data.sorting == 'category') {
        return (this.$data.sort_direction == 1 ? '▲' : '▼')
      }
      else {
        return '—'
      }
    },
    loadError() {
      return this.$store.state.load_error
    }
  },
  emits: ['prev'],
  methods: {
    toggleSelection(classId) {
      if (this.$store.state.selectedClasses.find(c => c == classId)) {
        this.$store.commit('deselectClass', {
          id: classId
        })
      }
      else if (this.$store.getters.getOverlaps(classId).length > 0) {
        // TODO jakiś alert jak są overlapy
        return
      }
      else {
        this.$store.commit('selectClass', {
          id: classId
        })
      }
    },
    openDetails(classId) {
      this.$store.commit('updateDetails',
      {
        id: classId
      })
    },
    previewInTimetable(classId) {
      this.$store.commit('updatePreview',
      {
        id: classId
      })
    },
    changeSorting(sortBy) {
      if (this.$data.sorting === sortBy) {
        this.$data.sort_direction *= -1
      }
      else {
        this.$data.sorting = sortBy
        this.$data.sort_direction = 1
      }
    },
    disablePreview() {
      this.$store.commit('updatePreview',
      {
        id: null
      })
      this.$store.commit('updateHighlight',
      {
        id: null
      })
    },
    highlightInTimetable(classId) {
      this.$store.commit('updateHighlight',
      {
        id: classId
      })
    },
    getCategoryImage(category) {
      return CategorySymbols.getCategorySymbol(category)
    }
  }
}
</script>

<style scoped>
.class-list-wrap {
  min-width: 20rem;
  padding: 1.5rem 0 0 0;
}
.controls {
  margin-bottom: 1.5rem;
}
label {
  display: block;
  font-size: 0.8rem;
  font-weight: 300;
}
input {
  border-radius: 0;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(66,92,130,0.25);
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  font-size: 0.8rem;
  font-family: Lato, sans-serif;
  font-weight: 500;
  padding: 4px;
  color: #425C81;
  transition: border-color 0.2s;
}
input:focus {
  border-color: rgba(66,92,130,1);
  shadow:none;
  outline:none;
}
ul {
  display: block;
  list-style-type: none;
  margin: 0;
  padding: 0;
}
li {
  margin: 0 0 0.5rem 0;
  display: block;
  background-color: white;
  min-height: 3rem;
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}
.item-symbol {
  width: 1.2rem;
}
.item-data {
  width: 10rem;
}
.item-data > p {
  font-size: 0.8rem;
  margin: 0;
}
.item-buttons {
  min-width: 2.2rem;
}
.item-buttons > button {
  background-color: inherit;
  border-color: #425C81;
  width: 2rem;
  height: 2rem;
  margin: 0 0.2rem 0 0;
  padding: 0;
  transition: background-color 0.2s;
}
.item-buttons > button:hover {
  background-color: #A5D4DE;
}
.item-buttons > button:disabled {
  opacity: 0.5;
}
.item-buttons > button:disabled:hover {
  background-color: inherit;
}
button > img {
  margin-top:4px;
  width:0.8rem;
}
.sorting-controls {
  margin: 0.5rem 0;
  font-size: 0.8rem;
  font-weight: 300;
}
.sorting-controls > span {
  margin: 0 0.3rem;
  cursor: pointer;
}
.bolded {
  font-weight: 800;
}
.item-selected {
  background-color: #D8E3E9
}
.highlightable:hover {
  outline-style: solid;
  outline-width: 1px;
  outline-color: #425C81;
}
.highlightable {
  outline-style: solid;
  outline-width: 1px;
  outline-color: #FFFFFF;
  transition: outline-color 0.2s;
}

.loading-placeholder {
  font-size: 1rem;
  outline-style: solid;
  outline-width: 1px;
  outline-color: white;
  margin: 1rem auto;
  padding: 1rem;
  width: 8rem;
  text-align: center;
  color: #425C81;
}

.pending {
  background-color: white;
}

.error {
  background-color: rgba(224, 97, 129, 0.2);
}

.placeholder-fade-enter-active, .placeholder-fade-leave-active {
  transition: opacity .4s ease
}

.placeholder-fade-enter-from, .placeholder-fade-leave-to {
  opacity: 0
}

</style>

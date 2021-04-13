<template>
    <div class="timetable-preview" :class="isOverlapping ? 'red' : 'green'"></div>
</template>

<script>
export default {
  name: 'TimetablePreview',
  props: {
    id: Number,
    starts: Number,
    duration: Number
  },
  computed: {
    isOverlapping() {
      return (this.$store.getters.getOverlaps(this.id).length > 0 ? true : false)
    }
  }
}
</script>

<style>
.timetable-preview {
  z-index: 3;
}
.red {
  background-color: rgba(224, 97, 129, 0.2);
}
.green {
  background-color: rgba(216, 227, 233, 0.5);
}
</style>

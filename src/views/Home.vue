<template lang="pug">
  v-container.home
    v-card(
      :width="$vuetify.breakpoint.mdAndUp ? '50%' : '100%'"
      :min-height="$vuetify.breakpoint.mdAndUp ? '50%' : '100%'"
    )
      v-toolbar(flat)
        v-progress-linear(
          :active="isLabeling"
          :indeterminate="isLabeling"
          absolute
          bottom
          color="cyan lighten-3"
        )
        v-toolbar-title {{ getToolbarTitle() }}
        v-spacer
        v-toolbar-items
          v-btn(icon @click="isSettingsMode = !isSettingsMode")
            v-icon {{ !isSettingsMode ? "mdi-settings" : "mdi-home" }}
          v-btn(icon @click="exportLabels")
            v-icon mdi-export-variant
      v-container(v-if="!isSettingsMode")
        v-img.mb-3(
          :src="base64 || require('@/assets/default.jpg')"
          min-width="100%"
          min-height="100%"
        )
        v-row
          v-col(v-for="item in classes" :key="item.labelName" cols="4")
            v-btn(
              rounded
              width="100%"
              @click="label(item.labelName)"
              :disabled="!base64 || isLabeling"
            )
              v-icon.mr-1 {{ item.icon }}
              div {{ item.labelName }}
      v-container(v-else)
        v-file-input(label="Dataset" webkitdirectory multiple @change="choosePath")
        ComboBox(
          label="Classes"
          :value="classes"
          :multiple="true"
          @add="addClass"
          @remove="removeClass"
        )
</template>

<script>
// @ is an alias to /src
import { saveAs } from 'file-saver';
import ComboBox from '@/components/ComboBox.vue';

export default {
  name: 'home',
  data() {
    return {
      isSettingsMode: true,
      isLabeling: false,
      base64: null,
      files: [],
      currentIndex: 0,
      classes: [
        {
          labelName: 'Cow',
          icon: 'mdi-cow',
        },
        {
          labelName: 'Bed',
          icon: 'mdi-bed-king',
        },
        {
          labelName: 'Clock',
          icon: 'mdi-clock',
        },
        {
          labelName: 'Apple',
          icon: 'mdi-food-apple',
        },
        {
          labelName: 'Cat',
          icon: 'mdi-cat',
        },

        {
          labelName: 'Airplane',
          icon: 'mdi-airplane',
        },
        {
          labelName: 'Television',
          icon: 'mdi-television',
        },
        {
          labelName: 'Dog',
          icon: 'mdi-dog',
        },
        {
          labelName: 'Dolphin',
          icon: 'mdi-fish',
        },
        {
          labelName: 'Spider',
          icon: 'mdi-spider',
        },

      ],
    };
  },
  methods: {
    getToolbarTitle() {
      if (this.isSettingsMode) {
        return 'Settings';
      }
      if (this.files.length > 0) {
        return this.files[this.currentIndex].file.name;
      }
      return 'Select working direction first';
    },
    label(value) {
      this.isLabeling = true;
      const timer = setTimeout(() => {
        this.files[this.currentIndex].label = value;
        this.currentIndex = (this.currentIndex + 1) % this.files.length;
        this.loadFile(this.files[this.currentIndex].file);
        this.isLabeling = false;
        clearTimeout(timer);
      }, 500);
    },
    exportLabels() {
      let csvContent = '\uFEFF';
      this.files.forEach((file) => {
        csvContent += `${file.file.name}, ${file.label}\r\n`;
      });
      const blob = new Blob(
        [csvContent],
        { type: 'text/csv;charset=utf-8' },
      );
      console.log(csvContent);
      saveAs(blob, 'labels.csv');
    },
    choosePath(files) {
      this.files = files.map(file => (
        {
          file,
          label: '',
        }
      ));
      this.loadFile(this.files[this.currentIndex].file);
    },
    loadFile(file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.base64 = reader.result;
      };
      reader.onerror = (error) => {
        console.log('Error: ', error);
      };
    },
    addClass(value) {
      this.classes = [...this.classes, value];
    },
    removeClass(index) {
      if (index >= 0) this.classes.splice(index, 1);
    },
  },
  components: {
    ComboBox,
  },
};
</script>
<style lang="scss" scoped>
.home {
  @include size(100%);
  @include flexCenter;
}
</style>

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
          v-btn(icon @click="isSettingsMode = !isSettingsMode" depressed)
            v-icon {{ !isSettingsMode ? "mdi-settings" : "mdi-home" }}
          v-btn(@click="$refs.upload.click()" depressed icon)
            v-icon mdi-compare
          input#upload.d-none(
            type="file"
            ref="upload"
            @change="compare"
            accept=".csv"
          )
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
        v-dialog(v-model="isModalVisible" max-width="50%")
          v-card
            v-card-title Latest Compare Result
            v-card-text Corresponded: {{ corresponded }}
            v-card-text Marked: {{ marked }}
            v-card-text Total: {{ correspondedResult.length }}
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
      isComparing: false,
      isModalVisible: false,
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
      correspondedResult: [],
    };
  },
  computed: {
    corresponded() {
      return this.correspondedResult.reduce(
        (accumulator, currentValue) => accumulator + (currentValue.correspond !== '' ? currentValue.correspond : 0), 0,
      );
    },
    marked() {
      return this.correspondedResult.reduce(
        (accumulator, currentValue) => accumulator + (currentValue.correspond !== '' ? 1 : 0), 0,
      );
    },
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
        csvContent += `${file.file.name},${file.label}\r\n`;
      });
      const blob = new Blob(
        [csvContent],
        { type: 'text/csv;charset=utf-8' },
      );
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
    compare(event) {
      this.isComparing = true;
      const fileObj = event.target.files[0];
      const reader = new FileReader();
      reader.readAsText(fileObj);
      reader.onload = (e) => {
        const csvString = e.target.result;
        const csv = csvString.split('\r\n').map(row => row.split(','));
        console.log(csv);
        this.correspondedResult = this.files.map((file) => {
          const index = csv.findIndex(row => row[0] === file.file.name);
          if (index >= 0 && csv[index][1] !== '') {
            if (file.label === csv[index][1]) {
              return {
                name: file.file.name,
                correspond: 1,
              };
            }
            return {
              name: file.file.name,
              correspond: 0,
            };
          }
          return {
            name: file.file.name,
            correspond: '',
          };
        });
        this.isModalVisible = true;
        console.log(this.correspondedResult);
      };
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

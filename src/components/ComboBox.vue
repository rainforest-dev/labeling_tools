<template lang="pug">
  .combobox
    v-combobox(
      :label="label"
      :value="value"
      chips
      :multiple="multiple"
      @click="isModalVisible = true;"
    )
      template(v-slot:selection="{ attrs, selected, item }")
        v-chip(
          v-bind="attrs"
          :input-value="selected"
          close
          @click:close="removeClass(item)"
        )
          v-icon.mr-1 {{ item.icon }}
          div {{ item.labelName }}
    v-dialog(v-model="isModalVisible" max-width="50%")
      v-card.pa-5
        v-text-field(label="Label Name" v-model="labelName" required)
        v-text-field(label="Icon" v-model="icon" required)
        v-btn(@click="addClass") Add Class

</template>
<script>
export default {
  name: 'combobox',
  props: {
    label: String,
    value: Array,
    multiple: Boolean,
  },
  data() {
    return {
      // eslint-disable-next-line vue/no-reserved-keys
      labelName: '',
      icon: '',
      isModalVisible: false,
    };
  },
  methods: {
    addClass() {
      this.$emit('add', {
        labelName: this.labelName,
        icon: this.icon,
      });
      this.isModalVisible = false;
      this.labelName = '';
      this.icon = '';
    },
    removeClass(item) {
      this.$emit('remove', this.value.indexOf(item));
    },
    focus() {
      this.isModalVisible = true;
    },
  },
};
</script>

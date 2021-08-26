<template>
  <v-container>
    <v-card class="pa-2">
      <v-card-title>Filter</v-card-title>
      <v-row>
        <v-col cols="6">
          <v-autocomplete v-model="broadcaster" :items="broadcasterList" label="BRC"></v-autocomplete>
        </v-col>
        <v-col cols="6">
          <v-autocomplete v-model="language" :items="languageList" label="LANGUAGE"></v-autocomplete>
        </v-col>
        <v-col cols="4">
          <v-text-field label="FREQ" v-model="inputFreq" :rules="[validateFreq]"></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-checkbox v-model="fiveHz" label="5kHz deviation"></v-checkbox>
        </v-col>
        <v-col cols="4" class="d-flex">
          <v-spacer></v-spacer>
          <v-btn @click="applyFreq" :disabled="disableApplyBtn">Apply</v-btn>
        </v-col>
      </v-row>
    </v-card>
    <v-data-table :headers="tableHeaders" :loading="loading" :items="tableDataFiltered"
                  :items-per-page="20" :mobile-breakpoint="0"
                  :footer-props="{'items-per-page-options':[10,20,50,-1],showFirstLastPage:true}"></v-data-table>
  </v-container>
</template>

<script>
import HelloWorld from '../components/HelloWorld'

export default {
  name: 'Home',
  data() {
    return {
      loading: true,
      publicPath: process.env.BASE_URL,
      tableHeaders: [
        {text: 'FREQ', value: 'FREQ'},
        {text: 'STRT', value: 'STRT'},
        {text: 'STOP', value: 'STOP'},
        {text: 'ZONES', value: 'ZONES'},
        {text: 'LOC', value: 'LOC'},
        {text: 'POWR', value: 'POWR'},
        {text: 'AZIMUTH', value: 'AZIMUTH'},
        {text: 'SLW', value: 'SLW'},
        {text: 'ANT', value: 'ANT'},
        {text: 'DAYS', value: 'DAYS'},
        {text: 'FDATE', value: 'FDATE'},
        {text: 'TDATE', value: 'TDATE'},
        {text: 'MOD', value: 'MOD'},
        {text: 'AFRQ', value: 'AFRQ'},
        {text: 'LANGUAGE', value: 'LANGUAGE'},
        {text: 'ADM', value: 'ADM'},
        {text: 'BRC', value: 'BRC'},
        {text: 'FMO', value: 'FMO'},
        {text: 'REQ', value: 'REQ'},
        {text: 'OLD', value: 'OLD'},
        {text: 'ALT1', value: 'ALT1'},
        {text: 'ALT2', value: 'ALT2'},
        {text: 'ALT3', value: 'ALT3'},
        {text: 'NOTES', value: 'NOTES'},
      ],
      jsonA21: [],
      jsonAdmin: [],
      jsonBroadcaster: [],
      jsonSite: [],
      broadcaster: 'All',
      language: 'All',
      freq: -1,
      inputFreq: '',
      fiveHz: false,
      disableApplyBtn: true
    }
  },
  computed: {
    tableDataAll() {
      let arr = []
      if (this.jsonA21.length && this.jsonAdmin.length && this.jsonBroadcaster.length && this.jsonSite.length) {
        arr = this.jsonA21.slice()
        arr = arr.map(radio => {
          radio.LOC = this.jsonSite.find(value => value.Code === radio.LOC).Site
          radio.BRC = this.jsonBroadcaster.find(value => value.CODE === radio.BRC).BROADCASTER
          return radio
        })
      }
      return arr
    },
    tableDataFiltered() {
      let arr = this.tableDataAll.slice()
      arr = arr.filter(radio => {
        if (this.broadcaster === 'All') {
          return true
        }
        return radio.BRC === this.broadcaster
      })
      arr = arr.filter(radio => {
        if (this.language === 'All') {
          return true
        }
        return radio.LANGUAGE === this.language
      })
      if (this.freq !== -1) {
        arr = arr.filter(radio => {
          if (this.fiveHz) {
            return parseInt(radio.FREQ) <= this.freq + 5 && parseInt(radio.FREQ) >= this.freq - 5
          } else {
            return parseInt(radio.FREQ) === this.freq
          }
        })
      }
      return arr
    },
    broadcasterList() {
      let arr = []
      arr.push('All')
      if (this.tableDataAll.length) {
        for (let radio of this.tableDataAll) {
          if (!arr.includes(radio.BRC)) {
            arr.push(radio.BRC)
          }
        }
      }
      return arr
    },
    languageList() {
      let arr = []
      arr.push('All')
      if (this.tableDataAll.length) {
        for (let radio of this.tableDataAll) {
          if (!arr.includes(radio.LANGUAGE)) {
            arr.push(radio.LANGUAGE)
          }
        }
      }
      return arr
    }
  },
  mounted() {
    this.getJsons()
  },
  methods: {
    getJsons() {
      this.loading = true
      Promise.all([
        this.$axios.get(this.publicPath + 'dump/a21.json').then(res => {
          this.jsonA21 = res.data
        }),
        this.$axios.get(this.publicPath + 'dump/admin.json').then(res => {
          this.jsonAdmin = res.data
        }),
        this.$axios.get(this.publicPath + 'dump/broadcaster.json').then(res => {
          this.jsonBroadcaster = res.data
        }),
        this.$axios.get(this.publicPath + 'dump/site.json').then(res => {
          this.jsonSite = res.data
        }),
      ]).then(() => {
        this.loading = false
      })
    },
    validateFreq(input) {
      if (input === '') {
        this.disableApplyBtn = false
        return true
      }
      if (!Number.isInteger(parseInt(input))) {
        this.disableApplyBtn = true
        return 'FREQ must be an integer'
      }
      let num = parseInt(input)
      if (num < 0 || num > 30000) {
        this.disableApplyBtn = true
        return 'FREQ must be in 0~30,000'
      }
      this.disableApplyBtn = false
      return true
    },
    applyFreq() {
      if (this.inputFreq === '') {
        this.freq = -1
      } else {
        this.freq = parseInt(this.inputFreq)
      }
    }
  },
  components: {
    HelloWorld,
  },
}
</script>

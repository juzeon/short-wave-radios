<template>
  <v-container>
    <v-card class="pa-2">
      <v-card-title><v-icon>mdi-filter</v-icon>条件筛选</v-card-title>
      <v-row>
        <v-col cols="6">
          <v-autocomplete v-model="broadcaster" :items="broadcasterList" label="电台"></v-autocomplete>
        </v-col>
        <v-col cols="6">
          <v-autocomplete v-model="language" :items="languageList" label="语言"></v-autocomplete>
        </v-col>
        <v-col cols="4">
          <v-text-field label="频率" v-model="inputFreq" :rules="[validateFreq]"></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-checkbox v-model="fivekHz" label="±5kHz 范围"></v-checkbox>
        </v-col>
        <v-col cols="4" class="d-flex">
          <v-spacer></v-spacer>
          <v-btn @click="applyFreq" :disabled="disableApplyBtn">提交</v-btn>
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
        {text: '频率', value: 'FREQ'},
        {text: '广播机构', value: 'BRC'},
        {text: '运行天数', value: 'DAYS'},
        {text: '开始时间（UTC）', value: 'STRT'},
        {text: '结束时间（UTC）', value: 'STOP'},
        {text: '语言', value: 'LANGUAGE'},
        {text: '功率（kW）', value: 'POWR'},
        {text: '最大辐射角', value: 'AZIMUTH'},
        {text: '发射站', value: 'LOC'},
        {text: '目标服务区', value: 'ZONES'},
        {text: '天线旋转角', value: 'SLW'},
        {text: '天线代码', value: 'ANT'},
        {text: '开始日期', value: 'FDATE'},
        {text: '截止日期', value: 'TDATE'},
        {text: '调制方式', value: 'MOD'},
        {text: '天线设计频率（kHz', value: 'AFRQ'},
        {text: '主管部门', value: 'ADM'},
        {text: '频率管理机构', value: 'FMO'},
        {text: '识别码', value: 'REQ'},
        /*{text: '旧数据', value: 'OLD'},
        {text: '备选频率1', value: 'ALT1'},
        {text: '备选频率2', value: 'ALT2'},
        {text: '备选频率3', value: 'ALT3'},*/
        {text: '备注', value: 'NOTES'},
      ],
      jsonA21: [],
      jsonAdmin: [],
      jsonBroadcaster: [],
      jsonSite: [],
      broadcaster: 'China National Radio',
      language: 'Zho',
      freq: -1,
      inputFreq: '',
      fivekHz: false,
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
          if (this.fivekHz) {
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
        return '请输入整型数'
      }
      let num = parseInt(input)
      if (num < 0 || num > 30000) {
        this.disableApplyBtn = true
        return '频率必须位于0-30000'
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

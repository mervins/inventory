import axios from 'axios';
import { Paragraph, Table, TableRow, TableCell, WidthType, HeadingLevel, AlignmentType, TextRun } from "docx";
export default {
    data: () => ({
        ipaddress: 'http://127.0.0.1:3308'
    }),
    methods: {
        toast(msg, type) {
            this.$toast(msg, {
                timeout: 2000,
                position: "top-center",
                type: type
            });
        },
        assign(data) {
            return JSON.parse(JSON.stringify(data));
        },
        back_to_previous() {
            window.history.go(-1);
        },
        separator_thousand(num) {
            return String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1,')
        },
        heading(heading) {
            return new Table({
                rows: [new TableRow({
                    children: heading.map((item) => {
                        return new TableCell({
                            width: { size: 100 / heading.length, type: WidthType.PERCENTAGE },
                            children: [new Paragraph({ children: [new TextRun({ bold: true, text: item, size: "25" })], alignment: AlignmentType.CENTER, })],
                        })
                    }),
                })]
            });
        },
        footer(total) {
            return new Table({
                rows: [new TableRow({
                    children: total.map((item) => {
                        return new TableCell({
                            width: { size: 100 / 2, type: WidthType.PERCENTAGE },
                            children: [new Paragraph({
                                children: [new TextRun({
                                    text: item,
                                    heading: HeadingLevel.HEADING_4,
                                    bold: true,
                                    color: "140b05",
                                    size: "25",
                                })],
                                alignment: AlignmentType.CENTER,
                            })],
                        })
                    })
                })]
            });
        },
        date_today() {
            var currentDateWithFormat = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
            console.log(currentDateWithFormat);
        },
        get_weekly(){
            var list_date = [];
            var currentDate = new Date();
            for(var x = 1; x <= 7; x++){
                var nextday = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + x));
                list_date.push(nextday.toJSON().slice(0, 10).replace(/-/g, '-'));
            } 
            console.log(list_date);
        },
        async get_product() {
            let temp_data = await axios.get('http://127.0.0.1:3308/api/product');
            // this.product = temp_data.data;
            return temp_data;
        },
    }
}
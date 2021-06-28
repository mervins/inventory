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
            // var currentDate = new Date();
            // alert(currentDate);
            var currentDateWithFormat = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
            console.log(currentDateWithFormat);
        },
        async get_product() {
            let temp_data = await axios.get('http://127.0.0.1:3308/api/product');
            // this.product = temp_data.data;
            return temp_data;
        },
    }
}
const express = require('express');
const Excel = require('exceljs');
const dayjs = require('dayjs');
const _ = require('lodash');
const signature = require('../../middleware/signature');
const moment = require('moment');
const router = express.Router();
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const sequelize = require('../../sequelize');
const { Op } = require('sequelize');
const { QueryTypes } = require('sequelize');
const Category = require('../../models/category');

const indexAction = async (req, res, next) => {
  const totalCategory = await Category.count();
  if (!totalCategory) return next();
  const result = await sequelize.query(
    `SELECT id, name, scores, rank() 
OVER ( order by scores desc ) 
AS 'rank' FROM (
SELECT p.id id,p.name name,( SUM(s.score)/${totalCategory}) scores 
FROM users p LEFT JOIN submissions s ON s.userId=p.id WHERE p.roleId=2 GROUP BY p.id
limit 20
) as result;`,
    { type: QueryTypes.SELECT }
  );
  res.json({ data: result });
};

const exportUrlAction = (req, res, next) => {
  const params = req.url.replace('/export-url', '');
  const url = `${req.protocol}://${req.get('host')}/core/ranks/export${params}`;
  const signedUrl = signature.sign(url);
  res.json({ data: { url: signedUrl } });
};

const exportAction = async (req, res, next) => {
  const workbook = new Excel.Workbook();

  const worksheet = workbook.addWorksheet('Sheet1');
  worksheet.columns = getWorksheetColumn();
  const date = dayjs().format('YYYYMMDD-HHmmss');

  res.setHeader(
    'Content-disposition',
    `attachment; filename=Report-${date}.xlsx`
  );
  res.setHeader(
    'Content-type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );

  let conditionSearch = {};
  if (req.query._search) {
    conditionSearch = {
      [Op.or]: {
        email: { [Op.like]: `%${req.query._search}%` },
      },
    };
    req.query._search = '';
  }

  const reports = await Submission.findAll({
    where: conditionSearch,
  });

  for (const report of reports) {
    addWorksheetRow(worksheet, report);
  }

  workbook.xlsx.write(res).then(() => {
    res.end();
  });
};

const getWorksheetColumn = () => {
  return [
    { header: 'Name', key: 'email' },
    { header: 'Score', key: 'score' },
    {
      header: 'Date',
      key: 'createdAt',
      toText: (Person) => {
        return moment(Person.createdAt).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  ];
};

const addWorksheetRow = (worksheet, report) => {
  const columns = getWorksheetColumn();
  const data = {};

  for (const column of columns) {
    const text = column.toText
      ? column.toText(report, column.key)
      : _.get(report, column.key);
    data[column.key] = Array.isArray(text) ? text : [text];
  }

  const totalRows = Math.max(
    ...Object.values(data).map(({ length }) => length)
  );
  const lastCellAddresses = {};
  let lastRow;

  for (let i = 0; i < totalRows; i++) {
    const rowData = {};

    for (const [key, value] of Object.entries(data)) {
      value[i] !== null && (rowData[key] = value[i]);
    }

    const row = worksheet.addRow(rowData);

    for (const key in rowData) {
      try {
        lastCellAddresses[key] = row.getCell(key).address;
        lastRow = lastCellAddresses[key].match(/\d+$/)[0];
      } catch (error) {}
    }
  }

  for (const start of Object.values(lastCellAddresses)) {
    const column = start.match(/^[A-Z]+/)[0];
    const end = `${column}${lastRow}`;

    if (start !== end) {
      worksheet.mergeCells(`${start}:${end}`);
      worksheet.getCell(start).alignment = { vertical: 'middle' };
    }
  }
};

router.use(authenticate);

router.get('/', authorize('rank.read'), indexAction);

module.exports = router;

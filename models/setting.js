'use strict';

const { DataTypes } = require('sequelize');
const yup = require('yup');
const Base = require('./base');
const sequelize = require('../sequelize');
const stringUtil = require('../utils/string');

class Setting extends Base {
  static searchable = ['key', 'value'];
  static getValidator() {
    const defaultBanner = {
      type: yup.string().oneOf([null, 'IMAGE', 'VIDEO']).nullable(),
      title: yup.string().nullable(),
      description: yup.string().nullable(),
      image: yup.mixed().when('type', {
        is: 'IMAGE',
        then: yup.string().nullable(),
        otherwise: yup.mixed().transform(() => null),
      }),
      video: yup.mixed().when('type', {
        is: 'VIDEO',
        then: yup.string().nullable(),
        otherwise: yup.mixed().transform(() => null),
      }),
      isActive: yup.boolean().required(),
    };

    return yup.object().shape({
      key: yup.string().required(),
      value: yup
        .mixed()
        .required()
        .when('key', {
          is: 'banners',
          then: yup
            .object()
            .noUnknown()
            .shape({
              branded: yup.object().noUnknown().shape(defaultBanner),
              unbranded: yup.object().noUnknown().shape(defaultBanner),
              classicUnbranded: yup.object().noUnknown().shape(defaultBanner),
            }),
        })
        // Terms and conditions
        .when('key', {
          is: 'tac',
          then: yup.object().noUnknown().shape({
            content: yup.string().required(),
          }),
        })
        .when('key', {
          is: 'faq',
          then: yup
            .object()
            .noUnknown()
            .shape({
              questions: yup.array().of(
                yup.object().noUnknown().shape({
                  question: yup.string().required(),
                  answer: yup.string().required(),
                })
              ),
            }),
        })
        // Wall of Fades: Merchandise
        .when('key', {
          is: 'campaigns.wofMerchandise',
          then: yup.object().noUnknown().shape({
            title: yup.string().nullable(),
            content: yup.string().nullable(),
            image: yup.string().nullable(),
          }),
        })
        // Wall of Fades: Workshop
        .when('key', {
          is: 'campaigns.wofWorkshop',
          then: yup.object().noUnknown().shape({
            title: yup.string().nullable(),
            content: yup.string().nullable(),
            image: yup.string().nullable(),
          }),
        })
        // Tebak Judul Metal
        .when('key', {
          is: 'campaigns.tjmMerchandise',
          then: yup.object().noUnknown().shape({
            title: yup.string().nullable(),
            content: yup.string().nullable(),
            image: yup.string().nullable(),
          }),
        })
        // HOP
        .when('key', {
          is: 'campaigns.hop',
          then: yup.object().noUnknown().shape({
            title: yup.string().nullable(),
            content: yup.string().nullable(),
            image: yup.string().nullable(),
          }),
        })
        //Engagement
        .when('key', {
          is: 'campaigns.engagement',
          then: yup.object().noUnknown().shape({
            title: yup.string().nullable(),
            content: yup.string().nullable(),
            image: yup.string().nullable(),
          }),
        })
        //Photo Challenge
        .when('key', {
          is: 'campaigns.photo',
          then: yup.object().noUnknown().shape({
            title: yup.string().nullable(),
            content: yup.string().nullable(),
            image: yup.string().nullable(),
          }),
        })
        //Album
        .when('key', {
          is: 'campaigns.album',
          then: yup.object().noUnknown().shape({
            title: yup.string().nullable(),
            content: yup.string().nullable(),
            image: yup.string().nullable(),
          }),
        })
        //Brabe talk
        .when('key', {
          is: 'campaigns.brabetalk',
          then: yup.object().noUnknown().shape({
            title: yup.string().nullable(),
            content: yup.string().nullable(),
            image: yup.string().nullable(),
          }),
        })
        .when('key', {
          is: 'campaigns.sneakers-1',
          then: yup.object().noUnknown().shape({
            title: yup.string().nullable(),
            content: yup.string().nullable(),
            image: yup.string().nullable(),
          }),
        })
        .when('key', {
          is: 'campaigns.magnumStudio',
          then: yup.object().noUnknown().shape({
            title: yup.string().nullable(),
            content: yup.string().nullable(),
            image: yup.string().nullable(),
            meta: yup.object().nullable(),
          }),
        })
        .when('$other', (other) => {
          yup.object().noUnknown().shape({
            title: yup.string().nullable(),
            content: yup.string().nullable(),
            image: yup.string().nullable(),
          });
        }),
    });
  }
}

Setting.init(
  {
    key: DataTypes.STRING,
    type: DataTypes.STRING,
    settingType: DataTypes.STRING,
    value: {
      type: DataTypes.TEXT,
      set(value) {
        const [type, result] = stringUtil.serialize(value);
        this.setDataValue('type', type);
        this.setDataValue('value', result);
      },
      get() {
        return stringUtil.unserialize(
          this.getDataValue('type'),
          this.getDataValue('value')
        );
      },
    },
  },
  {
    sequelize,
    modelName: 'Setting',
  }
);

module.exports = Setting;

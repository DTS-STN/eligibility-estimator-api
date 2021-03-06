import {
  LegalStatusOptions,
  MaritalStatusOptions,
  ResultOptions,
  ResultReasons,
} from '../types';
import { mockedRequestFactory } from './factory';

describe('sanity checks', () => {
  it('fails on age over 150', async () => {
    const { res } = await mockedRequestFactory({ age: 151 });
    expect(res.status).toEqual(400);
    expect(res.body.error).toEqual(ResultOptions.INVALID);
  });
  it('accepts age equal to 150', async () => {
    const { res } = await mockedRequestFactory({ age: 150 });
    expect(res.status).toEqual(200);
  });
  it('accepts valid Marital Status', async () => {
    const { res } = await mockedRequestFactory({
      age: 65,
      maritalStatus: MaritalStatusOptions.SINGLE,
    });
    expect(res.status).toEqual(200);
  });
  it('accepts valid Legal Status', async () => {
    const { res } = await mockedRequestFactory({
      age: 65,
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
    });
    expect(res.status).toEqual(200);
  });
  it('fails when years in Canada is greater than age minus 18', async () => {
    const { res } = await mockedRequestFactory({
      age: 65,
      yearsInCanadaSince18: 48,
    });
    expect(res.status).toEqual(400);
    expect(res.body.error).toEqual(ResultOptions.INVALID);
  });
  it('accepts when years in Canada is equal to age minus 18', async () => {
    const { res } = await mockedRequestFactory({
      age: 65,
      yearsInCanadaSince18: 47,
    });
    expect(res.status).toEqual(200);
  });
  it('fails when not partnered and "partnerReceivingOas" true', async () => {
    let { res } = await mockedRequestFactory({
      age: 65,
      maritalStatus: MaritalStatusOptions.SINGLE,
      partnerReceivingOas: true,
    });
    expect(res.status).toEqual(400);
    expect(res.body.error).toEqual(ResultOptions.INVALID);
  });
  it('accepts when not partnered and "partnerReceivingOas" false', async () => {
    let { res } = await mockedRequestFactory({
      age: 65,
      maritalStatus: MaritalStatusOptions.SINGLE,
      partnerReceivingOas: false,
    });
    expect(res.status).toEqual(200);
  });
  it('accepts when partnered and "partnerReceivingOas" present', async () => {
    const { res } = await mockedRequestFactory({
      age: 65,
      maritalStatus: MaritalStatusOptions.MARRIED,
      partnerReceivingOas: true,
    });
    expect(res.status).toEqual(200);
  });
});

describe('field requirement analysis', () => {
  it('requires 1 OAS and 1 GIS fields when nothing provided', async () => {
    const { res } = await mockedRequestFactory({});
    expect(res.body.oas.result).toEqual(ResultOptions.MORE_INFO);
    expect(res.body.oas.reason).toEqual(ResultReasons.MORE_INFO);
    expect(res.body.oas.missingFields.toString()).toEqual(
      ['income'].toString()
    );
    expect(res.body.gis.result).toEqual(ResultOptions.MORE_INFO);
    expect(res.body.gis.reason).toEqual(ResultReasons.MORE_INFO);
    expect(res.body.gis.missingFields.toString()).toEqual(
      ['income'].toString()
    );
    expect(res.body.allFields.toString()).toEqual(['income'].toString());
  });
  it('requires 3 OAS and 0 GIS fields when only income provided', async () => {
    const { res } = await mockedRequestFactory({ income: 10000 });
    expect(res.body.oas.result).toEqual(ResultOptions.MORE_INFO);
    expect(res.body.oas.reason).toEqual(ResultReasons.MORE_INFO);
    expect(res.body.oas.missingFields.toString()).toEqual(
      ['age', 'livingCountry', 'legalStatus'].toString()
    );
    expect(res.body.gis.result).toEqual(ResultOptions.MORE_INFO);
    expect(res.body.gis.reason).toEqual(ResultReasons.MORE_INFO);
    expect(res.body.gis.missingFields).toBeUndefined();
    expect(res.body.allFields.toString()).toEqual(
      ['income', 'age', 'livingCountry', 'legalStatus'].toString()
    );
  });
  it('requires 2 OAS and 0 GIS fields when only income/age provided', async () => {
    const { res } = await mockedRequestFactory({ income: 10000, age: 65 });
    expect(res.body.oas.result).toEqual(ResultOptions.MORE_INFO);
    expect(res.body.oas.reason).toEqual(ResultReasons.MORE_INFO);
    expect(res.body.oas.missingFields.toString()).toEqual(
      ['livingCountry', 'legalStatus'].toString()
    );
    expect(res.body.gis.result).toEqual(ResultOptions.MORE_INFO);
    expect(res.body.gis.reason).toEqual(ResultReasons.MORE_INFO);
    expect(res.body.gis.missingFields).toBeUndefined();
    expect(res.body.allFields.toString()).toEqual(
      ['income', 'age', 'livingCountry', 'legalStatus'].toString()
    );
  });
  it('requires 1 OAS and 0 GIS fields when only income/age/country provided', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 65,
      livingCountry: 'Canada',
    });
    expect(res.body.oas.result).toEqual(ResultOptions.MORE_INFO);
    expect(res.body.oas.reason).toEqual(ResultReasons.MORE_INFO);
    expect(res.body.oas.missingFields.toString()).toEqual(
      ['legalStatus'].toString()
    );
    expect(res.body.gis.result).toEqual(ResultOptions.MORE_INFO);
    expect(res.body.gis.reason).toEqual(ResultReasons.MORE_INFO);
    expect(res.body.gis.missingFields).toBeUndefined();
    expect(res.body.allFields.toString()).toEqual(
      ['income', 'age', 'livingCountry', 'legalStatus'].toString()
    );
  });
  it('requires 1 OAS and 0 GIS fields when only income/age/country/legal provided', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 65,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
    });
    expect(res.body.oas.result).toEqual(ResultOptions.MORE_INFO);
    expect(res.body.oas.reason).toEqual(ResultReasons.MORE_INFO);
    expect(res.body.oas.missingFields.toString()).toEqual(
      ['yearsInCanadaSince18'].toString()
    );
    expect(res.body.gis.result).toEqual(ResultOptions.MORE_INFO);
    expect(res.body.gis.reason).toEqual(ResultReasons.MORE_INFO);
    expect(res.body.gis.missingFields).toBeUndefined();
    expect(res.body.allFields.toString()).toEqual(
      [
        'income',
        'age',
        'livingCountry',
        'legalStatus',
        'yearsInCanadaSince18',
      ].toString()
    );
  });
  it('requires 0 OAS and 1 GIS fields when only income/age/country/legal/years provided', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 65,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
    });
    expect(res.body.oas.result).toEqual(ResultOptions.ELIGIBLE);
    expect(res.body.oas.reason).toEqual(ResultReasons.NONE);
    expect(res.body.oas.missingFields).toBeUndefined();
    expect(res.body.gis.result).toEqual(ResultOptions.MORE_INFO);
    expect(res.body.gis.reason).toEqual(ResultReasons.MORE_INFO);
    expect(res.body.gis.missingFields.toString()).toEqual(
      ['maritalStatus'].toString()
    );
    expect(res.body.allFields.toString()).toEqual(
      [
        'income',
        'age',
        'livingCountry',
        'legalStatus',
        'yearsInCanadaSince18',
        'maritalStatus',
      ].toString()
    );
  });
  it('requires 0 OAS and 0 GIS fields when only income/age/country/legal/years/marital=single provided', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 65,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatusOptions.SINGLE,
    });
    expect(res.body.oas.result).toEqual(ResultOptions.ELIGIBLE);
    expect(res.body.oas.reason).toEqual(ResultReasons.NONE);
    expect(res.body.oas.missingFields).toBeUndefined();
    expect(res.body.gis.result).toEqual(ResultOptions.ELIGIBLE);
    expect(res.body.gis.reason).toEqual(ResultReasons.NONE);
    expect(res.body.gis.missingFields).toBeUndefined();
    expect(res.body.allFields.toString()).toEqual(
      [
        'income',
        'age',
        'livingCountry',
        'legalStatus',
        'yearsInCanadaSince18',
        'maritalStatus',
      ].toString()
    );
  });
  it('requires 0 OAS and 1 GIS fields when only income/age/country/legal/years/marital=married provided', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 65,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatusOptions.MARRIED,
    });
    expect(res.body.oas.result).toEqual(ResultOptions.ELIGIBLE);
    expect(res.body.oas.reason).toEqual(ResultReasons.NONE);
    expect(res.body.oas.missingFields).toBeUndefined();
    expect(res.body.gis.result).toEqual(ResultOptions.MORE_INFO);
    expect(res.body.gis.reason).toEqual(ResultReasons.MORE_INFO);
    expect(res.body.gis.missingFields.toString()).toEqual(
      ['partnerReceivingOas'].toString()
    );
    expect(res.body.allFields.toString()).toEqual(
      [
        'income',
        'age',
        'livingCountry',
        'legalStatus',
        'yearsInCanadaSince18',
        'maritalStatus',
        'partnerReceivingOas',
      ].toString()
    );
  });
  it('requires 0 OAS and 0 GIS fields when all provided', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 65,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatusOptions.MARRIED,
      partnerReceivingOas: true,
    });
    expect(res.body.oas.result).toEqual(ResultOptions.ELIGIBLE);
    expect(res.body.oas.reason).toEqual(ResultReasons.NONE);
    expect(res.body.oas.missingFields).toBeUndefined();
    expect(res.body.gis.result).toEqual(ResultOptions.ELIGIBLE);
    expect(res.body.gis.reason).toEqual(ResultReasons.NONE);
    expect(res.body.gis.missingFields).toBeUndefined();
    expect(res.body.allFields.toString()).toEqual(
      [
        'income',
        'age',
        'livingCountry',
        'legalStatus',
        'yearsInCanadaSince18',
        'maritalStatus',
        'partnerReceivingOas',
      ].toString()
    );
  });
});

describe('basic OAS scenarios', () => {
  it('returns "ineligible" when income over 129757', async () => {
    const { res } = await mockedRequestFactory({
      income: 129758,
    });
    expect(res.body.oas.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.oas.reason).toEqual(ResultReasons.INCOME);
  });
  it('returns "ineligible" when not citizen', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 65,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.NONE,
      yearsInCanadaSince18: 20,
    });
    expect(res.body.oas.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.oas.reason).toEqual(ResultReasons.CITIZEN);
  });
  it('returns "ineligible" when citizen and under 10 years in Canada', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 65,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
    });
    expect(res.body.oas.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.oas.reason).toEqual(ResultReasons.YEARS_IN_CANADA);
  });
  it('returns "eligible" when citizen and 10 years in Canada', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 65,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
    });
    expect(res.body.oas.result).toEqual(ResultOptions.ELIGIBLE);
    expect(res.body.oas.reason).toEqual(ResultReasons.NONE);
  });
  it('returns "eligible" when living in Agreement and 20 years in Canada', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 65,
      livingCountry: 'Agreement',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
    });
    expect(res.body.oas.result).toEqual(ResultOptions.ELIGIBLE);
    expect(res.body.oas.reason).toEqual(ResultReasons.NONE);
  });
  it('returns "conditionally eligible" when living in Agreement and under 20 years in Canada', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 65,
      livingCountry: 'Agreement',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 19,
    });
    expect(res.body.oas.result).toEqual(ResultOptions.CONDITIONAL);
    expect(res.body.oas.reason).toEqual(ResultReasons.YEARS_IN_CANADA);
  });
  it('returns "eligible" when living in No Agreement and 20 years in Canada', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 65,
      livingCountry: 'No Agreement',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
    });
    expect(res.body.oas.result).toEqual(ResultOptions.ELIGIBLE);
    expect(res.body.oas.reason).toEqual(ResultReasons.NONE);
  });
  it('returns "ineligible" when living in No Agreement and under 20 years in Canada', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 65,
      livingCountry: 'No Agreement',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 19,
    });
    expect(res.body.oas.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.oas.reason).toEqual(ResultReasons.YEARS_IN_CANADA);
  });
  it('returns "eligible when 65" when age 55 and citizen and 20 years in Canada', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 55,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
    });
    expect(res.body.oas.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.oas.reason).toEqual(ResultReasons.AGE);
  });
});

describe('basic GIS scenarios', () => {
  it('returns "needs more info" when missing marital status', async () => {
    const { res } = await mockedRequestFactory({
      age: 65,
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
    });
    expect(res.body.gis.result).toEqual(ResultOptions.MORE_INFO);
    expect(res.body.gis.reason).toEqual(ResultReasons.MORE_INFO);
  });
  it('returns "needs more info" when missing income', async () => {
    const { res } = await mockedRequestFactory({
      age: 65,
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatusOptions.SINGLE,
    });
    expect(res.body.gis.result).toEqual(ResultOptions.MORE_INFO);
    expect(res.body.gis.reason).toEqual(ResultReasons.MORE_INFO);
  });
  it('returns "needs more info" when partnered and "partnerReceivingOas" missing', async () => {
    let { res } = await mockedRequestFactory({
      age: 65,
      maritalStatus: MaritalStatusOptions.MARRIED,
      partnerReceivingOas: undefined,
    });
    expect(res.body.gis.result).toEqual(ResultOptions.MORE_INFO);
    expect(res.body.gis.reason).toEqual(ResultReasons.MORE_INFO);
  });
  it('returns "ineligible" when single and income over 18216', async () => {
    const { res } = await mockedRequestFactory({
      income: 18217,
      age: 65,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatusOptions.SINGLE,
    });
    expect(res.body.gis.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.gis.reason).toEqual(ResultReasons.INCOME);
  });
  it('returns "eligible" when single and income under 18216', async () => {
    const { res } = await mockedRequestFactory({
      income: 18216,
      age: 65,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatusOptions.SINGLE,
    });
    expect(res.body.gis.result).toEqual(ResultOptions.ELIGIBLE);
    expect(res.body.gis.reason).toEqual(ResultReasons.NONE);
  });
  it('returns "ineligible" when married and no partner OAS and income over 43680', async () => {
    const { res } = await mockedRequestFactory({
      income: 43681,
      age: 65,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatusOptions.MARRIED,
      partnerReceivingOas: false,
    });
    expect(res.body.gis.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.gis.reason).toEqual(ResultReasons.INCOME);
  });
  it('returns "eligible" when married and no partner OAS and income under 43680', async () => {
    const { res } = await mockedRequestFactory({
      income: 43680,
      age: 65,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatusOptions.MARRIED,
      partnerReceivingOas: false,
    });
    expect(res.body.gis.result).toEqual(ResultOptions.ELIGIBLE);
    expect(res.body.gis.reason).toEqual(ResultReasons.NONE);
  });
  it('returns "ineligible" when married and partner OAS and income over 24048', async () => {
    const { res } = await mockedRequestFactory({
      income: 24049,
      age: 65,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatusOptions.MARRIED,
      partnerReceivingOas: true,
    });
    expect(res.body.gis.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.gis.reason).toEqual(ResultReasons.INCOME);
  });
  it('returns "eligible" when married and partner OAS and income under 24048', async () => {
    const { res } = await mockedRequestFactory({
      income: 24048,
      age: 65,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatusOptions.MARRIED,
      partnerReceivingOas: true,
    });
    expect(res.body.gis.result).toEqual(ResultOptions.ELIGIBLE);
    expect(res.body.gis.reason).toEqual(ResultReasons.NONE);
  });
});

describe('basic Allowance scenarios', () => {
  it('returns "ineligible" when income over (or equal to) 35616', async () => {
    const { res } = await mockedRequestFactory({
      income: 35616,
    });
    expect(res.body.allowance.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.allowance.reason).toEqual(ResultReasons.INCOME);
  });
  it('returns "needs more info" when income under 35616', async () => {
    const { res } = await mockedRequestFactory({
      income: 35615,
    });
    expect(res.body.allowance.result).toEqual(ResultOptions.MORE_INFO);
    expect(res.body.allowance.reason).toEqual(ResultReasons.MORE_INFO);
  });
  it('returns "ineligible" when age over 64', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 65,
    });
    expect(res.body.allowance.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.allowance.reason).toEqual(ResultReasons.AGE);
  });
  it('returns "ineligible" when age under 60', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 59,
    });
    expect(res.body.allowance.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.allowance.reason).toEqual(ResultReasons.AGE);
  });
  it('returns "needs more info" when age 60', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 60,
    });
    expect(res.body.allowance.result).toEqual(ResultOptions.MORE_INFO);
    expect(res.body.allowance.reason).toEqual(ResultReasons.MORE_INFO);
  });
  it('returns "ineligible" when not citizen', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 60,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.NONE,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatusOptions.MARRIED,
      partnerReceivingOas: true,
    });
    expect(res.body.allowance.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.allowance.reason).toEqual(ResultReasons.CITIZEN);
  });
  it('returns "ineligible" when citizen and under 10 years in Canada', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 60,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
      maritalStatus: MaritalStatusOptions.MARRIED,
      partnerReceivingOas: true,
    });
    expect(res.body.allowance.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.allowance.reason).toEqual(ResultReasons.YEARS_IN_CANADA);
  });
  it('returns "ineligible" when widowed', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 60,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatusOptions.WIDOWED,
      partnerReceivingOas: false,
    });
    expect(res.body.allowance.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.allowance.reason).toEqual(ResultReasons.MARITAL);
  });
  it('returns "ineligible" when single', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 60,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatusOptions.SINGLE,
      partnerReceivingOas: false,
    });
    expect(res.body.allowance.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.allowance.reason).toEqual(ResultReasons.MARITAL);
  });
  it('returns "ineligible" when partner not receiving OAS', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 60,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatusOptions.MARRIED,
      partnerReceivingOas: false,
    });
    expect(res.body.allowance.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.allowance.reason).toEqual(ResultReasons.OAS);
  });
  it('returns "eligible" when citizen and 10 years in Canada', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 60,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatusOptions.MARRIED,
      partnerReceivingOas: true,
    });
    expect(res.body.allowance.result).toEqual(ResultOptions.ELIGIBLE);
    expect(res.body.allowance.reason).toEqual(ResultReasons.NONE);
  });
  it('returns "eligible" when living in Agreement and 10 years in Canada', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 60,
      livingCountry: 'Agreement',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatusOptions.MARRIED,
      partnerReceivingOas: true,
    });
    expect(res.body.allowance.result).toEqual(ResultOptions.ELIGIBLE);
    expect(res.body.allowance.reason).toEqual(ResultReasons.NONE);
  });
  it('returns "conditionally eligible" when living in Agreement and under 10 years in Canada', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 60,
      livingCountry: 'Agreement',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
      maritalStatus: MaritalStatusOptions.MARRIED,
      partnerReceivingOas: true,
    });
    expect(res.body.allowance.result).toEqual(ResultOptions.CONDITIONAL);
    expect(res.body.allowance.reason).toEqual(ResultReasons.YEARS_IN_CANADA);
  });
  it('returns "eligible" when living in No Agreement and 10 years in Canada', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 60,
      livingCountry: 'No Agreement',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatusOptions.MARRIED,
      partnerReceivingOas: true,
    });
    expect(res.body.allowance.result).toEqual(ResultOptions.ELIGIBLE);
    expect(res.body.allowance.reason).toEqual(ResultReasons.NONE);
  });
  it('returns "ineligible" when living in No Agreement and under 10 years in Canada', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 60,
      livingCountry: 'No Agreement',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
      maritalStatus: MaritalStatusOptions.MARRIED,
      partnerReceivingOas: true,
    });
    expect(res.body.allowance.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.allowance.reason).toEqual(ResultReasons.YEARS_IN_CANADA);
  });
});

describe('basic Allowance for Survivor scenarios', () => {
  it('returns "ineligible" when income over (or equal to) 25920', async () => {
    const { res } = await mockedRequestFactory({
      income: 25920,
    });
    expect(res.body.afs.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.afs.reason).toEqual(ResultReasons.INCOME);
  });
  it('returns "needs more info" when income under 25920', async () => {
    const { res } = await mockedRequestFactory({
      income: 25919,
    });
    expect(res.body.afs.result).toEqual(ResultOptions.MORE_INFO);
    expect(res.body.afs.reason).toEqual(ResultReasons.MORE_INFO);
  });
  it('returns "ineligible" when age over 64', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 65,
    });
    expect(res.body.afs.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.afs.reason).toEqual(ResultReasons.AGE);
  });
  it('returns "ineligible" when age under 60', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 59,
    });
    expect(res.body.afs.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.afs.reason).toEqual(ResultReasons.AGE);
  });
  it('returns "needs more info" when age 60', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 60,
    });
    expect(res.body.afs.result).toEqual(ResultOptions.MORE_INFO);
    expect(res.body.afs.reason).toEqual(ResultReasons.MORE_INFO);
  });
  it('returns "ineligible" when not citizen', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 60,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.NONE,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatusOptions.WIDOWED,
      partnerReceivingOas: false,
    });
    expect(res.body.afs.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.afs.reason).toEqual(ResultReasons.CITIZEN);
  });
  it('returns "ineligible" when citizen and under 10 years in Canada', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 60,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
      maritalStatus: MaritalStatusOptions.WIDOWED,
      partnerReceivingOas: false,
    });
    expect(res.body.afs.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.afs.reason).toEqual(ResultReasons.YEARS_IN_CANADA);
  });
  it('returns "ineligible" when married', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 60,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatusOptions.MARRIED,
      partnerReceivingOas: false,
    });
    expect(res.body.afs.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.afs.reason).toEqual(ResultReasons.MARITAL);
  });
  it('returns "eligible" when widowed', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 60,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatusOptions.WIDOWED,
      partnerReceivingOas: false,
    });
    expect(res.body.afs.result).toEqual(ResultOptions.ELIGIBLE);
    expect(res.body.afs.reason).toEqual(ResultReasons.NONE);
  });
  it('returns "eligible" when living in Agreement and 10 years in Canada', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 60,
      livingCountry: 'Agreement',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatusOptions.WIDOWED,
      partnerReceivingOas: false,
    });
    expect(res.body.afs.result).toEqual(ResultOptions.ELIGIBLE);
    expect(res.body.afs.reason).toEqual(ResultReasons.NONE);
  });
  it('returns "conditionally eligible" when living in Agreement and under 10 years in Canada', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 60,
      livingCountry: 'Agreement',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
      maritalStatus: MaritalStatusOptions.WIDOWED,
      partnerReceivingOas: false,
    });
    expect(res.body.afs.result).toEqual(ResultOptions.CONDITIONAL);
    expect(res.body.afs.reason).toEqual(ResultReasons.YEARS_IN_CANADA);
  });
  it('returns "eligible" when living in No Agreement and 10 years in Canada', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 60,
      livingCountry: 'No Agreement',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatusOptions.WIDOWED,
      partnerReceivingOas: false,
    });
    expect(res.body.afs.result).toEqual(ResultOptions.ELIGIBLE);
    expect(res.body.afs.reason).toEqual(ResultReasons.NONE);
  });
  it('returns "ineligible" when living in No Agreement and under 10 years in Canada', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 60,
      livingCountry: 'No Agreement',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
      maritalStatus: MaritalStatusOptions.WIDOWED,
      partnerReceivingOas: false,
    });
    expect(res.body.afs.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.afs.reason).toEqual(ResultReasons.YEARS_IN_CANADA);
  });
});

describe('thorough personas', () => {
  it('Tanu Singh: OAS eligible, GIS eligible', async () => {
    const { res } = await mockedRequestFactory({
      income: 17000,
      age: 65,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 47,
      maritalStatus: MaritalStatusOptions.MARRIED,
      partnerReceivingOas: true,
    });
    expect(res.body.oas.result).toEqual(ResultOptions.ELIGIBLE);
    expect(res.body.oas.reason).toEqual(ResultReasons.NONE);
    expect(res.body.gis.result).toEqual(ResultOptions.ELIGIBLE);
    expect(res.body.gis.reason).toEqual(ResultReasons.NONE);
  });
  it('Habon Aden: OAS conditionally eligible, GIS ineligible due to income', async () => {
    const { res } = await mockedRequestFactory({
      income: 28000,
      age: 66,
      livingCountry: 'Jamaica',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 18,
      maritalStatus: MaritalStatusOptions.SINGLE,
      partnerReceivingOas: undefined,
    });
    expect(res.body.oas.result).toEqual(ResultOptions.CONDITIONAL);
    expect(res.body.oas.reason).toEqual(ResultReasons.YEARS_IN_CANADA);
    expect(res.body.gis.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.gis.reason).toEqual(ResultReasons.INCOME);
  });
  it('Miriam Krayem: OAS eligible when 65, GIS ineligible due to income', async () => {
    const { res } = await mockedRequestFactory({
      income: 40000,
      age: 55,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 30,
      maritalStatus: MaritalStatusOptions.DIVORCED,
      partnerReceivingOas: undefined,
    });
    expect(res.body.oas.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.oas.reason).toEqual(ResultReasons.AGE);
    expect(res.body.gis.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.gis.reason).toEqual(ResultReasons.OAS);
  });
  it('Adam Smith: OAS eligible when 65, GIS ineligible due to income', async () => {
    const { res } = await mockedRequestFactory({
      income: 25000,
      age: 62,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.PERMANENT_RESIDENT,
      yearsInCanadaSince18: 15,
      maritalStatus: MaritalStatusOptions.WIDOWED,
      partnerReceivingOas: undefined,
    });
    expect(res.body.oas.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.oas.reason).toEqual(ResultReasons.AGE);
    expect(res.body.gis.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.gis.reason).toEqual(ResultReasons.OAS);
  });
});

describe('thorough extras', () => {
  it('returns "ineligible due to years in Canada" when living in Canada and 9 years in Canada', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 65,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
      maritalStatus: MaritalStatusOptions.SINGLE,
      partnerReceivingOas: undefined,
    });
    expect(res.body.oas.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.oas.reason).toEqual(ResultReasons.YEARS_IN_CANADA);
    expect(res.body.gis.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.gis.reason).toEqual(ResultReasons.OAS);
  });
  it('returns "conditionally eligible" when living in Agreement and 9 years in Canada', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 65,
      livingCountry: 'Agreement',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
      maritalStatus: MaritalStatusOptions.SINGLE,
      partnerReceivingOas: undefined,
    });
    expect(res.body.oas.result).toEqual(ResultOptions.CONDITIONAL);
    expect(res.body.oas.reason).toEqual(ResultReasons.YEARS_IN_CANADA);
    expect(res.body.gis.result).toEqual(ResultOptions.ELIGIBLE);
    expect(res.body.gis.reason).toEqual(ResultReasons.NONE);
  });
  it('returns "eligible" when living in Canada and 10 years in Canada', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 65,
      livingCountry: 'Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatusOptions.SINGLE,
      partnerReceivingOas: undefined,
    });
    expect(res.body.oas.result).toEqual(ResultOptions.ELIGIBLE);
    expect(res.body.oas.reason).toEqual(ResultReasons.NONE);
    expect(res.body.gis.result).toEqual(ResultOptions.ELIGIBLE);
    expect(res.body.gis.reason).toEqual(ResultReasons.NONE);
  });
  it('returns "ineligible due to years in Canada" when not living in Canada and 19 years in Canada', async () => {
    const { res } = await mockedRequestFactory({
      income: 10000,
      age: 65,
      livingCountry: 'Not Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 19,
      maritalStatus: MaritalStatusOptions.SINGLE,
      partnerReceivingOas: undefined,
    });
    expect(res.body.oas.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.oas.reason).toEqual(ResultReasons.YEARS_IN_CANADA);
    expect(res.body.gis.result).toEqual(ResultOptions.INELIGIBLE);
    expect(res.body.gis.reason).toEqual(ResultReasons.OAS);
  });
  it('returns "eligible" when not living in Canada and 20 years in Canada', async () => {
    const { res } = await mockedRequestFactory({
      income: 15000,
      age: 65,
      livingCountry: 'Not Canada',
      legalStatus: LegalStatusOptions.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatusOptions.SINGLE,
      partnerReceivingOas: undefined,
    });
    expect(res.body.oas.result).toEqual(ResultOptions.ELIGIBLE);
    expect(res.body.oas.reason).toEqual(ResultReasons.NONE);
    expect(res.body.gis.result).toEqual(ResultOptions.ELIGIBLE);
    expect(res.body.gis.reason).toEqual(ResultReasons.NONE);
  });
});

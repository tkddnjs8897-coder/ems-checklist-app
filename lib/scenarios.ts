import type { Scenario } from "./types";
import { findCatalogLabel } from "./catalog";

import fallTrauma from "./scenarios/fallTrauma";
import cardiacArrest from "./scenarios/cardiacArrest";
import childbirth from "./scenarios/childbirth";
import vaginalBleeding from "./scenarios/vaginalBleeding";
import eclampsia from "./scenarios/eclampsia";

import nonTraumaShock from "./scenarios/nonTraumaShock";
import airwayObstruction from "./scenarios/airwayObstruction";
import dyspnea from "./scenarios/dyspnea";
import hyperventilation from "./scenarios/hyperventilation";
import chestPain from "./scenarios/chestPain";
import bradycardia from "./scenarios/bradycardia";
import tachycardia from "./scenarios/tachycardia";
import syncope from "./scenarios/syncope";
import hemoptysis from "./scenarios/hemoptysis";
import giBleeding from "./scenarios/giBleeding";
import alteredMentalStatus from "./scenarios/alteredMentalStatus";
import stroke from "./scenarios/stroke";
import seizure from "./scenarios/seizure";
import hypoglycemia from "./scenarios/hypoglycemia";
import feverSepsis from "./scenarios/feverSepsis";
import behavioralEmergency from "./scenarios/behavioralEmergency";
import abdominalPain from "./scenarios/abdominalPain";
import nauseaVomiting from "./scenarios/nauseaVomiting";
import diarrhea from "./scenarios/diarrhea";
import dizziness from "./scenarios/dizziness";

import multiTrauma from "./scenarios/multiTrauma";
import headInjury from "./scenarios/headInjury";
import spineInjury from "./scenarios/spineInjury";
import chestInjury from "./scenarios/chestInjury";
import abdomenPelvisInjury from "./scenarios/abdomenPelvisInjury";
import limbInjury from "./scenarios/limbInjury";

import burn from "./scenarios/burn";
import electricalInjury from "./scenarios/electricalInjury";
import drowning from "./scenarios/drowning";
import hypothermia from "./scenarios/hypothermia";
import heatIllness from "./scenarios/heatIllness";
import poisoning from "./scenarios/poisoning";
import animalBite from "./scenarios/animalBite";
import anaphylaxis from "./scenarios/anaphylaxis";

import trafficAccident from "./scenarios/trafficAccident";
import bluntInjury from "./scenarios/bluntInjury";
import laceration from "./scenarios/laceration";
import stabPenetrating from "./scenarios/stabPenetrating";
import machineryInjury from "./scenarios/machineryInjury";
import asphyxiation from "./scenarios/asphyxiation";

const SOURCE = "119구급대원 현장응급처치 표준지침(2023년 개정본)";

const allScenarios: Scenario[] = [
  fallTrauma,
  cardiacArrest,
  childbirth,
  vaginalBleeding,
  eclampsia,

  nonTraumaShock,
  airwayObstruction,
  dyspnea,
  hyperventilation,
  chestPain,
  bradycardia,
  tachycardia,
  syncope,
  hemoptysis,
  giBleeding,
  alteredMentalStatus,
  stroke,
  seizure,
  hypoglycemia,
  feverSepsis,
  behavioralEmergency,
  abdominalPain,
  nauseaVomiting,
  diarrhea,
  dizziness,

  multiTrauma,
  headInjury,
  spineInjury,
  chestInjury,
  abdomenPelvisInjury,
  limbInjury,

  burn,
  electricalInjury,
  drowning,
  hypothermia,
  heatIllness,
  poisoning,
  animalBite,
  anaphylaxis,

  trafficAccident,
  bluntInjury,
  laceration,
  stabPenetrating,
  machineryInjury,
  asphyxiation,
];

export const scenarioRegistry: Record<string, Scenario> = Object.fromEntries(
  allScenarios.map((s) => [s.id, s])
);

export const readyScenarioIds = new Set(
  allScenarios.filter((s) => s.status === "ready").map((s) => s.id)
);

export function getScenario(slug: string): Scenario {
  return (
    scenarioRegistry[slug] ?? {
      id: slug,
      title: findCatalogLabel(slug) ?? slug,
      status: "planned",
      steps: [],
    }
  );
}

export const contentSource = SOURCE;

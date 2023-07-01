import { DynamicModule, ForwardReference, Type } from '@nestjs/common'
import { Routes } from '@nestjs/core'
import * as moment from 'moment'

const horoscope = ["Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn"]
const days = [21, 20, 21, 21, 22, 22, 23, 24, 24, 24, 23, 22]
const zodiac = ["Monkey","Rooster","Dog","Pig","Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Sheep"]

/**
 Generate horoscope from the Date String given, format: YYYY-MM-DD | Ex: 1998-02-01
*/
export function generateHoroscope (date: string): string {
	let month = +moment(date).startOf('day').format('MM') - 1
	let day = +moment(date).startOf('day').format('DD')
  if(month == 0 && day <= 20) {
		month = 11
  } else if(day < days[month]){
		month--
  }
  return horoscope[month];
}

export function generateZodiac (date: string) {
   const n: number = +(
		new Intl.DateTimeFormat(
		"fr-TN-u-ca-chinese",
		{
			day: "2-digit",
			month: "long",
			year: "numeric"
		}).format(Date.parse(date)).substring(0, 4)
	)

  return zodiac[n % 12]
}

/** Load all modules from routes*/ 
export function destructModuleFromRoutes (routes: Routes = []): (Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference<any>)[] {
  return routes.reduce((a, b) => {
    if(Array.isArray(b.children) && b.children.length > 0) return [...a, ...destructModuleFromRoutes(b.children as Routes)]
    else if(!b.module) return a
    
    return [...a, b.module]
  }, [])
}
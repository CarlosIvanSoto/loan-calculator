'use client'

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { add, differenceInDays, format, setDate } from "date-fns";
import { LoanTable } from "./loan-table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { es } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils";

export type Payment = {
  number: number
  days: number
  dueDate: Date
  principal: number
  interest: number
  fixedPaymentNoVAT: number
  interestVAT: number
  totalPayment: number
  remainingBalance: number
}

const LoanCalculator = () => {
  const [loanStartDate, setLoanStartDate] = useState<Date | undefined>(new Date())
  const [loanAmount, setLoanAmount] = useState<number>(10000);
  const [loanTerm, setLoanTerm] = useState<number>(60);
  const [interestRate, setInterestRate] = useState<number>(10);
  const [includeIVA, setIncludeIVA] = useState<boolean>(true);
  const [iva, setIVA] = useState<number>(19);
  
  const [monthlyPayment, setMonthlyPayment] = useState<string>("");
  const [biweeklyPayment, setBiweeklyPayment] = useState<string>("");
  const [monthlyAmortizationSchedule, setMonthlyAmortizationSchedule] = useState<Payment[]>([])
  const [biweeklyAmortizationSchedule, setBiweeklyAmortizationSchedule] = useState<Payment[]>([])
  // const [dayAmortizationSchedule, setDayAmortizationSchedule] = useState<Payment[]>([])

  const terms = [3, 6, 12, 24, 36, 48, 60]

  useEffect(() => {
    const monthlyRate = interestRate / 1200 // Convert annual rate to monthly
    const monthlyFee = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -loanTerm))
    // const monthlyFee = (loanAmount * monthlyRate) / (1 - (1 + monthlyRate)** -loanTerm)
    
    const monthlyInterest = loanAmount * monthlyRate
    
    const biweeklyRate = monthlyRate / 2
    const biweeklyFee = (loanAmount * biweeklyRate) / (1 - Math.pow(1 + biweeklyRate, -(loanTerm * 2)))
    // const biweeklyFee = (loanAmount * biweeklyRate) / (1 - (1 + biweeklyRate)** -(loanTerm * 2))
    
    const biweeklyInterest = loanAmount * biweeklyRate
    
    if (includeIVA) {
      const ivaRate = iva/100
      const monthlyPayment = monthlyFee + monthlyInterest * ivaRate
      const biweeklyPayment = biweeklyFee + biweeklyInterest * ivaRate

      setMonthlyPayment(monthlyPayment.toFixed(2))
      setBiweeklyPayment(biweeklyPayment.toFixed(2))
    } else {
      setMonthlyPayment(monthlyFee.toFixed(2))
      setBiweeklyPayment(biweeklyFee.toFixed(2))
    } 


    const initialPayment: Payment = {
      number: 0,
      days: 0,
      dueDate: loanStartDate || new Date(),
      principal: 0,
      interest: 0,
      fixedPaymentNoVAT: 0,
      interestVAT: 0,
      totalPayment: 0,
      remainingBalance: loanAmount
    } 
    const daySchedule: Payment[] = [];
    const biweeklySchedule: Payment[] = [];
    const monthlySchedule: Payment[] = [];


    const dayRate = interestRate / (360 * 100) // Convert annual rate to day
    const numberDays = differenceInDays(setDate(add(loanStartDate || new Date(), { months: loanTerm }), (loanStartDate || new Date()).getDate() > 15 ? 16 : 1), loanStartDate || new Date())
    const dayPayment = (loanAmount * dayRate) / (1 - Math.pow(1 + dayRate, -numberDays))
    
    // DAY
    Array(loanTerm * 2).keys().reduce<Payment>((prev, x) => {
      const dueDatePayment = prev.dueDate.getDate() > 15 ? setDate(add(prev.dueDate, { months: 1 }), 1) : setDate(prev.dueDate, 16)
      const daysPayment = differenceInDays(dueDatePayment, prev.dueDate)
      const biweeklyPayment = dayPayment * daysPayment
      const interestPayment = prev.remainingBalance * (dayRate * daysPayment)
      const principalPayment = biweeklyPayment - interestPayment;
      const IvaAmount = includeIVA ? interestPayment * (iva/100) : 0;
      const newSchedule: Payment = {
        number: x + 1, // numero
        days: daysPayment, // días
        dueDate: dueDatePayment, // fecha de vencimiento
        principal: principalPayment, // Amortización de capital
        interest: interestPayment, // Intereses sin IVA
        fixedPaymentNoVAT: biweeklyPayment, // Pago fijo sin IVA
        interestVAT: IvaAmount, // IVA de los intereses
        totalPayment: biweeklyPayment + IvaAmount, // Pago total del periodo
        remainingBalance: prev.remainingBalance - principalPayment // Saldo Insoluto
      }
      daySchedule.push(newSchedule) 
      return newSchedule
    }, initialPayment)

    // BIWEEKLY
    Array(loanTerm * 2).keys().reduce<Payment>((prev, x) => {
      const dueDatePayment = prev.dueDate.getDate() > 15 ? setDate(add(prev.dueDate, { months: 1 }), 1) : setDate(prev.dueDate, 16)
      const daysPayment = differenceInDays(dueDatePayment, prev.dueDate)
      const interestPayment = prev.remainingBalance * biweeklyRate
      const principalPayment = biweeklyFee - interestPayment;
      const IvaAmount = includeIVA ? interestPayment * (iva/100) : 0;
      const newSchedule: Payment = {
        number: x + 1, // numero
        days: daysPayment, // días
        dueDate: dueDatePayment, // fecha de vencimiento
        principal: principalPayment, // Amortización de capital
        interest: interestPayment, // Intereses sin IVA
        fixedPaymentNoVAT: biweeklyFee, // Pago fijo sin IVA
        interestVAT: IvaAmount, // IVA de los intereses
        totalPayment: biweeklyFee + IvaAmount, // Pago total del periodo
        remainingBalance: prev.remainingBalance - principalPayment // Saldo Insoluto
      }
      biweeklySchedule.push(newSchedule) 
      return newSchedule
    }, initialPayment)

    // MONTHLY
    Array(loanTerm).keys().reduce<Payment>((prev, x) => {
      const dueDatePayment = setDate(add(prev.dueDate, { months: 1 }), 1)
      const daysPayment = differenceInDays(dueDatePayment, prev.dueDate)
      const interestPayment = prev.remainingBalance * monthlyRate;
      const principalPayment = monthlyFee - interestPayment;
      const IvaAmount = includeIVA ? interestPayment * (iva/100) : 0;
      const newSchedule: Payment = {
        number: x + 1,
        days: daysPayment,
        dueDate: dueDatePayment,
        principal: principalPayment,
        interest: interestPayment,
        fixedPaymentNoVAT: monthlyFee,
        interestVAT: IvaAmount,
        totalPayment: monthlyFee + IvaAmount,
        remainingBalance: prev.remainingBalance - principalPayment
      }
      monthlySchedule.push(newSchedule) 
      return newSchedule

    }, initialPayment)

    // setDayAmortizationSchedule(daySchedule)
    setBiweeklyAmortizationSchedule(biweeklySchedule)
    setMonthlyAmortizationSchedule(monthlySchedule)

  }, [loanStartDate, loanAmount, loanTerm, interestRate, includeIVA, iva])
  
  return (
    <div className="flex space-x-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          {/* <CardTitle>Loan Repayment Calculator</CardTitle> */}
          <CardTitle>Calculadora de amortización de préstamos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="loanAmount">Fecha de inicio</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !loanStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {loanStartDate ? format(loanStartDate, "PPP", { locale: es }) : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={loanStartDate}
                    onSelect={setLoanStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="loanAmount">Importe a solicitar</Label>
              <Input
                id="loanAmount"
                type="number"
                min="2000"
                step="1000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loanTerm">Plazo (meses)</Label>
              <Slider defaultValue={[terms.indexOf(loanTerm)]} min={0} max={6} step={1} onValueChange={([value]) => setLoanTerm(terms[value])}/>
              <div className="flex justify-between">
                {terms.map(month => 
                  <Label className="flex-1 text-center" key={month}>{month}</Label>
                )}
              </div>
            </div>

            {/* <div>
              <Label htmlFor="loanTerm">Plazo (meses)</Label>
              <Input
                id="loanTerm"
                type="number"
                min="3"
                max="60"
                step="3"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
              />
            </div> */}

            <div>
              <Label htmlFor="interestRate">Tasa de interés fija (anual %)</Label>
              <Input
                id="interestRate"
                type="number"
                min="0"
                max="50"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Label htmlFor="iva">IVA de préstamo</Label>
              <Label htmlFor="includeIVA">Incluir IVA</Label>

              <Input
                id="iva"
                type="number"
                min="0"
                max="50"
                step="0.1"
                value={iva}
                onChange={(e) => setIVA(Number(e.target.value))}
              />

              <Switch
                id="includeIVA"
                checked={includeIVA}
                onCheckedChange={checked => setIncludeIVA(checked)}
              />
            </div>

            {/* <Button onClick={calculatePayments}>Calcular Payments</Button> */}
            
            {monthlyPayment && biweeklyPayment && (
              <div className="space-y-2 text-center">
                <div>
                  <Label>Tu pago mensual seria:</Label>
                  <div className="font-bold">${monthlyPayment}</div>
                </div>
                
                <div>
                  <Label>Tu pago quincenal seria:</Label>
                  <div className="font-bold">${biweeklyPayment}</div>
                </div>

                {includeIVA && <Label>IVA de interés incluido.</Label>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <section className="space-y-4">
        {monthlyPayment && biweeklyPayment && (
        <div className="grid grid-cols-4 gap-1">
          <Label>Monto del crédito</Label>
          <Label>{new Intl.NumberFormat("es-MX", {
              style: "currency",
              currency: "MXN",
            }).format(loanAmount)}</Label>

          <Label>Fecha de inicio de crédito</Label>
          <Label>{format(loanStartDate || new Date(), "P", { locale: es })}</Label>

          <Label>Plazo en meses</Label>
          <Label>{loanTerm} MESES</Label>

          {/* <Label>Fecha de vencimiento del crédito</Label>
          <Label>{format(add(loanStartDate || new Date(), { months: loanTerm }), "P", { locale: es })}</Label> */}

          <Label>Fecha de vencimiento del crédito</Label>
          <Label>{format(monthlyAmortizationSchedule[monthlyAmortizationSchedule.length - 1].dueDate, "P", { locale: es })}</Label>

          <Label>Número de pagos</Label>
          <Label>{loanTerm * 2}</Label>

          <Label>Tasa de interés anual sin IVA</Label>
          <Label>{interestRate} %</Label>

          <Label>Frecuencia de pago</Label>
          <Label>QUINCENAL</Label>

          <Label>Monto total a pagar</Label>
          <Label>{new Intl.NumberFormat("es-MX", {
              style: "currency",
              currency: "MXN",
            }).format(biweeklyAmortizationSchedule.reduce((prev, curr) => prev + curr.totalPayment, 0))}
          </Label>
        </div>
        )}
        <Tabs defaultValue="biweekly">
          <TabsList className="">
            <TabsTrigger value="biweekly">Quincenal</TabsTrigger>
            <TabsTrigger value="monthly">Mensual</TabsTrigger>
            {/* <TabsTrigger value="dayBiweekly">QUINCENAL (día)</TabsTrigger> */}
          </TabsList>
          <TabsContent value="biweekly">
            <LoanTable data={biweeklyAmortizationSchedule}/>
          </TabsContent>
          <TabsContent value="monthly">
            <LoanTable data={monthlyAmortizationSchedule} />
          </TabsContent>
          {/* <TabsContent value="dayBiweekly">
            <LoanTable data={dayAmortizationSchedule} visibility={{ days: true}}/>
          </TabsContent> */}
        </Tabs>
      </section>
      {/* <pre>{JSON.stringify({table: amortizationSchedule}, null, 2)}</pre> */}
    </div>
  )
};

export default LoanCalculator;

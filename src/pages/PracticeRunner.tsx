  import { useState, useEffect, useCallback } from "react";
  import { useParams, useNavigate } from "react-router-dom";
  import { Button } from "@/components/ui/button";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Slider } from "@/components/ui/slider";
  import { Progress } from "@/components/ui/progress";
  import { Badge } from "@/components/ui/badge";
  import { Separator } from "@/components/ui/separator";
  import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
  import { MathRenderer } from "@/components/MathRenderer";
  import { X, Clock, HelpCircle, Eye, EyeOff, Check, AlertCircle, Sparkles, Lightbulb, BookOpen } from "lucide-react";
  import confetti from "canvas-confetti";
  import { useUserStats } from "@/hooks/useUserStats";
  import { usePracticeSession } from "@/hooks/usePracticeSession";
  import { useQuestionAttempt } from "@/hooks/useQuestionAttempt";
  import { useTopicProgress } from "@/hooks/useTopicProgress";
  import { toast } from "@/hooks/use-toast";


  interface VariableConfig {
    min: number;
    max: number;
    default: number;
  }


  interface QuestionData {
    stem: string;
    hint: string;
    answer: string;
    explanation: string;
    variables?: Record<string, VariableConfig>;
  }


  // Helper functions for math logic
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);


  // Template interpolation with full dynamic logic
  const interpolateTemplate = (template: string, vars: Record<string, number>): string => {
    // Numbers M1
    const power = vars.power ?? 28;
    const constant = vars.constant ?? 2;
    const power_mod_4 = power % 4;
    const i_cycle = ['1', 'i', '-1', '-i'];
    const i_power_value = i_cycle[power_mod_4];
    let final_answer = '';
    switch (power_mod_4) {
      case 0: final_answer = `${1 + constant}`; break;
      case 1: final_answer = `i + ${constant}`; break;
      case 2: final_answer = `${-1 + constant}`; break;
      case 3: final_answer = `-i + ${constant}`; break;
    }


    // Numbers M2
    const whole = vars.whole ?? 3;
    const recurring = vars.recurring ?? 6;
    const difference = whole * 9 + recurring;
    const recurring_gcd = gcd(difference, 9);
    const simplified_num = difference / recurring_gcd;
    const simplified_den = 9 / recurring_gcd;


    // Numbers M3
    const base = vars.base ?? 5;
    const exponent = vars.exponent ?? 104;
    const modulus = vars.modulus ?? 7;
    
    // Find the actual multiplicative order (cycle length)
    let order = 1;
    let currentMod = base % modulus;
    const startVal = currentMod;
    while (order < modulus) {
      currentMod = (currentMod * base) % modulus;
      if (currentMod === startVal) break;
      order++;
    }
    const cycle_length = order;
    const remainder_exp = exponent % cycle_length;
    
    // Calculate base^remainder_exp mod modulus
    let power_result = 1;
    for (let i = 0; i < remainder_exp; i++) {
      power_result = (power_result * base) % modulus;
    }
    const remainder_answer = power_result;
    
    // Keep old variables for backward compatibility in templates
    const modulus_minus_1 = modulus - 1;
    const quotient = Math.floor(exponent / modulus_minus_1);
    const base_power_result = Math.pow(base, remainder_exp);


    // Numbers M4
    const div_rule_sum = vars.div_rule_sum ?? 4;
    const correct_div11_x = ((div_rule_sum % 11) + 11) % 11;


    // LCM HCF M1
    const num1 = vars.num1 ?? 30, num2 = vars.num2 ?? 50;
    const num1_factors = '2 \\times 3 \\times 5';
    const num2_factors = '2 \\times 5^2';
    const hcf_result = gcd(num1, num2);
    const lcm_result = lcm(num1, num2);


    // LCM fractions (need to first simplify each fraction and then LCM)
    const nums = [vars.frac1_num || 7, vars.frac2_num || 63, vars.frac3_num || 9];
    const dens = [vars.frac1_den || 9, vars.frac2_den || 8, vars.frac3_den || 7];

    // Simplify each fraction
    const gcd1 = gcd(nums[0], dens[0]);
    const gcd2 = gcd(nums[1], dens[1]);
    const gcd3 = gcd(nums[2], dens[2]);
    const simple_fracs = [
      { num: nums[0] / gcd1, den: dens[0] / gcd1 },
      { num: nums[1] / gcd2, den: dens[1] / gcd2 },
      { num: nums[2] / gcd3, den: dens[2] / gcd3 }
    ];
    const simplified_nums = [simple_fracs[0].num, simple_fracs[1].num, simple_fracs[2].num];
    const simplified_dens = [simple_fracs[0].den, simple_fracs[1].den, simple_fracs[2].den];
    const numerator_lcm_s = lcm(lcm(simplified_nums[0], simplified_nums[1]), simplified_nums[2]);
    const denominator_gcd_s = gcd(gcd(simplified_dens[0], simplified_dens[1]), simplified_dens[2]);
    const fraction_lcm_s = `${numerator_lcm_s}/${denominator_gcd_s}`;


    // LCM original fraction method for old display/calculation
    const numerator_lcm = lcm(lcm(nums[0], nums[1]), nums[2]);
    const denominator_gcd = gcd(gcd(dens[0], dens[1]), dens[2]);
    const fraction_lcm = `${numerator_lcm}/${denominator_gcd}`;


    // LCM ratio
    const ratio1 = vars.ratio1 || 2, ratio2 = vars.ratio2 || 3, r_hcf = vars.hcf || 9;
    const num1_calc = ratio1 * r_hcf;
    const num2_calc = ratio2 * r_hcf;
    const product_calc = num1_calc * num2_calc;
    const ratio_lcm = product_calc / r_hcf;


    // LCM greatest length
    const length1 = vars.length1 ?? 14, length2 = vars.length2 ?? 21, length3 = vars.length3 ?? 35;
    const lengths_gcd = gcd(gcd(length1, length2), length3);


    // Percentages M1 (percent relationship)
    const percent1 = vars.percent1 || 80, percent2 = vars.percent2 || 50;
    const percent_of_A = ((percent1 / percent2) * 100).toFixed(0);


    // Percentages M2 (fraction percent)
    const numerator1 = vars.numerator1 || 3, denominator1 = vars.denominator1 || 4;
    const numerator2 = vars.numerator2 || 1, denominator2 = vars.denominator2 || 2;
    const fraction_percent = (((numerator1 / denominator1) / (numerator2 / denominator2)) * 100).toFixed(0);


    // Percentages M3 (percent decrease)
    const original = vars.original || 40, current = vars.current || 29;
    const decrease_value = original - current;
    const percent_decrease_raw = (decrease_value / original) * 100;
    const percent_decrease = Number.isInteger(percent_decrease_raw) 
      ? String(percent_decrease_raw) 
      : percent_decrease_raw.toFixed(1);


    // Percentages M4 (chain percent, also showing with number as unit)
    const chain_result = (percent1 / 100 * percent2 / 100 * (vars.number || 300));
    const chain_percent = chain_result.toString();


    const replacements: Record<string, string | number> = {
      power, constant, power_mod_4, i_power_value, final_answer,
      whole, recurring, difference, simplified_numerator: simplified_num, simplified_denominator: simplified_den,
      simplified_fraction: `${simplified_num}/${simplified_den}`,
      base, exponent, modulus, modulus_minus_1, quotient, remainder_exp, base_power_result, remainder_answer,
      div_rule_sum, correct_div11_x,
      num1, num2, num1_factors, num2_factors, hcf_result, lcm_result,
      frac1_num: nums[0], frac2_num: nums[1], frac3_num: nums[2],
      frac1_den: dens[0], frac2_den: dens[1], frac3_den: dens[2],
      numerator_lcm, denominator_gcd, fraction_lcm,
      ratio1, ratio2, hcf: r_hcf, ratio_lcm, num1_calc, num2_calc, product_calc,
      length1, length2, length3, lengths_gcd,
      percent1, percent2, percent_of_A, numerator1, denominator1, numerator2, denominator2, fraction_percent,
      original, current, decrease_value, percent_decrease,
      chain_percent: `${chain_percent}`,
      chain_result,
      number: vars.number || 300,
      // For LCM of simplified fractions
      simplified_num1: simple_fracs[0].num,
      simplified_den1: simple_fracs[0].den,
      simplified_num2: simple_fracs[1].num,
      simplified_den2: simple_fracs[1].den,
      simplified_num3: simple_fracs[2].num,
      simplified_den3: simple_fracs[2].den,
      numerator_lcm_s, denominator_gcd_s, fraction_lcm_s,
      simplified_nums_list: simplified_nums.join(", "),
      simplified_dens_list: simplified_dens.join(", "),
    };


    return template.replace(/\$\{([a-zA-Z0-9_]+)\}/g, (_, key) => String(replacements[key] ?? key));
  };


  const practiceQuestions: Record<string, Record<string, QuestionData>> = {
    numbers: {
      m1: {
        stem: "Calculate the value of $i^{${power}} + ${constant}$, where $i$ is the imaginary unit.",
        hint: "Powers of $i$ repeat every 4: $i^1 = i$, $i^2 = -1$, $i^3 = -i$, $i^4 = 1$. Find the remainder when ${power} is divided by 4.",
        answer: "${final_answer}",
        explanation: "Step 1:\n$$i^4 = 1 \\text{, so powers repeat every 4}$$\n\nStep 2:\n$$${power} \\bmod 4 = ${power_mod_4}$$\n\nStep 3:\n$$i^{${power}} = i^{${power_mod_4}} = ${i_power_value}$$\n\nStep 4:\n$$i^{${power}} + ${constant} = ${i_power_value} + ${constant} = ${final_answer}$$\n\nFinal Answer: $${final_answer}$",
        variables: { power: { min: 20, max: 100, default: 28 }, constant: { min: 1, max: 5, default: 2 } }
      },
      m2: {
        stem: "Express $${whole}.\\overline{${recurring}}$ in its simplest rational form.",
        hint: "Let $x = ${whole}.\\overline{${recurring}}$, then multiply by 10 and subtract to eliminate the recurring part.",
        answer: "${simplified_fraction}",
        explanation: "Step 1:\n$$\\text{Let } x = ${whole}.\\overline{${recurring}}$$\n\nStep 2:\n$$10x = ${whole}${recurring}.\\overline{${recurring}}$$\n\nStep 3:\n$$10x - x = ${difference}$$\n\nStep 4:\n$$9x = ${difference}$$\n\nStep 5:\n$$x = \\frac{${difference}}{9} = \\frac{${simplified_numerator}}{${simplified_denominator}}$$\n\nFinal Answer: $\\frac{${simplified_numerator}}{${simplified_denominator}}$",
        variables: { whole: { min: 1, max: 9, default: 3 }, recurring: { min: 1, max: 9, default: 6 } }
      },
      m3: {
  stem: "Find the remainder when $${base}^{${exponent}}$ is divided by $${modulus}$.",
  hint: "Pattern the powers of ${base} modulo ${modulus}. If ${modulus} is prime and gcd(${base}, ${modulus}) = 1, you can use Fermat’s Little Theorem.",
  answer: "${remainder_answer}",
  explanation:
    "By Fermat’s little theorem: \\( ${base}^{${modulus_minus_1}} \\equiv 1 \\pmod{${modulus}} \\). " +
    "Write \\( ${exponent} = ${quotient}\\times ${modulus_minus_1} + ${remainder_exp} \\). " +
    "Then \\( ${base}^{${exponent}} = ( ${base}^{${modulus_minus_1}} )^{${quotient}}\\, ${base}^{${remainder_exp}} " +
    "\\equiv 1^{${quotient}}\\, ${base_power_result} \\equiv ${remainder_answer} \\pmod{${modulus}} \\).",
  variables: {
    base:     { min: 2, max: 9,   default: 5 },
    exponent: { min: 50, max: 200, default: 104 },
    modulus:  { min: 3, max: 11,  default: 7 }
  }
},

      m4: {
        stem: "Find the smallest value of $x$ such that $2579x25963$ is divisible by $11$.",
        hint: "For divisibility by 11, the alternating sum of digits must be divisible by 11 or equal to 0.",
        answer: "${correct_div11_x}",
        explanation: "Step 1:\n$$\\text{Alternating sum: } 2-5+7-9+x-2+5-9+6-3$$\n\nStep 2:\n$$= x - 8$$\n\nStep 3:\n$$\\text{For divisibility by 11: } (x-8) \\equiv 0 \\pmod{11}$$\n\nStep 4:\n$$x \\equiv 8 \\pmod{11}$$\n\nStep 5:\n$$\\text{Smallest single digit: } x = 8$$\n\nFinal Answer: $8$",
        variables: { div_rule_sum: { min: 8, max: 8, default: 8 } }
      }
    },
    "lcm-hcf": {
      m1: {
        stem: "Find both the HCF and LCM of $${num1}$ and $${num2}$.Format:HCF: , LCM: ",
        hint: "Use prime factorization: Take lowest powers for HCF, highest powers for LCM.",
        answer: "HCF: ${hcf_result}, LCM: ${lcm_result}",
        explanation: "Step 1:\n$$${num1} = ${num1_factors}$$\n\nStep 2:\n$$${num2} = ${num2_factors}$$\n\nStep 3:\n$$\\text{HCF (common factors, lowest powers)} = ${hcf_result}$$\n\nStep 4:\n$$\\text{LCM (all factors, highest powers)} = ${lcm_result}$$\n\nFinal Answer: HCF: $${hcf_result}$, LCM: $${lcm_result}$",
        variables: { num1: { min: 10, max: 90, default: 30 }, num2: { min: 20, max: 90, default: 50 } }
      },
      m2: {
        stem: "Find the LCM of $\\frac{${frac1_num}}{${frac1_den}}$, $\\frac{${frac2_num}}{${frac2_den}}$, $\\frac{${frac3_num}}{${frac3_den}}$ (simplify your answer).",
        hint: "LCM of fractions: $\\frac{\\text{LCM of numerators}}{\\text{GCD of denominators}}$. Simplify each fraction first.",
        answer: "${fraction_lcm_s}",
        explanation: "Step 1:\n$$\\text{Simplify: } ${simplified_nums_list} \\text{ over } ${simplified_dens_list}$$\n\nStep 2:\n$$\\text{LCM(numerators)} = ${numerator_lcm_s}$$\n\nStep 3:\n$$\\text{GCD(denominators)} = ${denominator_gcd_s}$$\n\nStep 4:\n$$\\text{LCM} = \\frac{${numerator_lcm_s}}{${denominator_gcd_s}} = ${fraction_lcm_s}$$\n\nFinal Answer: $${fraction_lcm_s}$",
        variables: { frac1_num: { min: 2, max: 15, default: 7 }, frac1_den: { min: 2, max: 15, default: 9 }, frac2_num: { min: 2, max: 70, default: 63 }, frac2_den: { min: 2, max: 15, default: 8 }, frac3_num: { min: 2, max: 15, default: 9 }, frac3_den: { min: 2, max: 15, default: 7 } }
      },
      m3: {
        stem: "Two numbers are in the ratio $${ratio1}:${ratio2}$ with HCF $${hcf}$. Find their LCM.",
        hint: "The numbers are $${ratio1} \\times ${hcf}$ and $${ratio2} \\times ${hcf}$. Use the formula: LCM = $\\frac{a \\times b}{\\text{HCF}}$",
        answer: "${ratio_lcm}",
        explanation: "Step 1:\n$$\\text{Numbers are: } ${ratio1} \\times ${hcf} = ${num1_calc} \\text{ and } ${ratio2} \\times ${hcf} = ${num2_calc}$$\n\nStep 2:\n$$\\text{LCM} = \\frac{${num1_calc} \\times ${num2_calc}}{${hcf}}$$\n\nStep 3:\n$$\\text{LCM} = \\frac{${product_calc}}{${hcf}} = ${ratio_lcm}$$\n\nFinal Answer: $${ratio_lcm}$",
        variables: { ratio1: { min: 2, max: 8, default: 2 }, ratio2: { min: 2, max: 12, default: 3 }, hcf: { min: 2, max: 20, default: 9 } }
      },
      m4: {
        stem: "Find greatest length exactly measuring $${length1}$m, $${length2}$m, $${length3}$m.",
        hint: "Find the GCD (Greatest Common Divisor) of all three numbers.",
        answer: "${lengths_gcd}",
        explanation: "Step 1:\n$$\\text{Find GCD of } ${length1}, ${length2}, ${length3}$$\n\nStep 2:\n$$\\text{Prime factorize each number}$$\n\nStep 3:\n$$\\text{Take common factors with lowest powers}$$\n\nStep 4:\n$$\\text{GCD} = ${lengths_gcd}$$\n\nFinal Answer: $${lengths_gcd}$ m",
        variables: { length1: { min: 10, max: 30, default: 14 }, length2: { min: 15, max: 35, default: 21 }, length3: { min: 20, max: 65, default: 35 } }
      }
    },
    "percentages": {
      m1: {
        stem: "If $${percent1}\\%$ of $A$ equals $${percent2}\\%$ of $B$, what percent of $A$ is $B$?",
        hint: "Set up the equation: $\\frac{${percent1}}{100}A = \\frac{${percent2}}{100}B$ and solve for $B$ in terms of $A$.",
        answer: "${percent_of_A}%",
        explanation: "Step 1:\n$$\\frac{${percent1}}{100}A = \\frac{${percent2}}{100}B$$\n\nStep 2:\n$$B = \\frac{${percent1}}{${percent2}} \\times A$$\n\nStep 3:\n$$B = \\frac{${percent1} \\times 100}{${percent2}} \\% \\text{ of } A$$\n\nStep 4:\n$$B = ${percent_of_A}\\% \\text{ of } A$$\n\nFinal Answer: $${percent_of_A}\\%$",
        variables: { percent1: { min: 10, max: 99, default: 80 }, percent2: { min: 10, max: 99, default: 50 } }
      },
      m2: {
        stem: "$\\dfrac{${numerator1}}{${denominator1}}$ is what percent of $\\dfrac{${numerator2}}{${denominator2}}$?",
        hint: "Divide the first fraction by the second, then multiply by 100.",
        answer: "${fraction_percent}%",
        explanation: "Step 1:\n$$\\text{Percent} = \\frac{\\frac{${numerator1}}{${denominator1}}}{\\frac{${numerator2}}{${denominator2}}} \\times 100$$\n\nStep 2:\n$$= \\frac{${numerator1}}{${denominator1}} \\times \\frac{${denominator2}}{${numerator2}} \\times 100$$\n\nStep 3:\n$$= \\frac{${numerator1} \\times ${denominator2}}{${denominator1} \\times ${numerator2}} \\times 100$$\n\nStep 4:\n$$= ${fraction_percent}\\%$$\n\nFinal Answer: $${fraction_percent}\\%$",
        variables: { numerator1: { min: 1, max: 9, default: 3 }, denominator1: { min: 2, max: 12, default: 4 }, numerator2: { min: 1, max: 7, default: 1 }, denominator2: { min: 2, max: 12, default: 2 } }
      },
      m3: {
        stem: "Staff decreased from $${original}$ to $${current}$. What is the percent decrease?",
        hint: "Use the formula: Percent decrease = $\\frac{\\text{Original} - \\text{Current}}{\\text{Original}} \\times 100$",
        answer: "${percent_decrease}%",
        explanation: "Step 1:\n$$\\text{Decrease} = ${original} - ${current} = ${decrease_value}$$\n\nStep 2:\n$$\\text{Percent decrease} = \\frac{${decrease_value}}{${original}} \\times 100$$\n\nStep 3:\n$$= ${percent_decrease}\\%$$\n\nFinal Answer: $${percent_decrease}\\%$",
        variables: { original: { min: 10, max: 120, default: 40 }, current: { min: 2, max: 120, default: 29 } }
      },
      m4: {
        stem: "Calculate $${percent1}\\%$ of $${percent2}\\%$ of $${number}$.",
        hint: "Multiply the fractions: $\\frac{${percent1}}{100} \\times \\frac{${percent2}}{100} \\times ${number}$",
        answer: "${chain_percent}",
        explanation: "Step 1:\n$$${percent1}\\% \\text{ of } ${percent2}\\% \\text{ of } ${number}$$\n\nStep 2:\n$$= \\frac{${percent1}}{100} \\times \\frac{${percent2}}{100} \\times ${number}$$\n\nStep 3:\n$$= \\frac{${percent1} \\times ${percent2}}{10000} \\times ${number}$$\n\nStep 4:\n$$= ${chain_percent}$$\n\nFinal Answer: $${chain_percent}$",
        variables: { percent1: { min: 10, max: 90, default: 20 }, percent2: { min: 10, max: 90, default: 25 }, number: { min: 10, max: 999, default: 300 } }
      }
    }
  };


  export default function PracticeRunner() {
    const { topic, model } = useParams();
    const navigate = useNavigate();

    // Hooks
    const { updateStats } = useUserStats();
    const { startSession, endSession } = usePracticeSession();
    const { saveAttempt } = useQuestionAttempt();
    const { updateProgress } = useTopicProgress(topic || "", model || "");

    const [timeLeft, setTimeLeft] = useState(50);
    const [isTimerActive, setIsTimerActive] = useState(true);
    const [showHint, setShowHint] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [userAnswer, setUserAnswer] = useState("");
    const [attempts, setAttempts] = useState(1);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [isDynamic, setIsDynamic] = useState(false);
    const [variables, setVariables] = useState<Record<string, number>>({});
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
    const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
    const [aiExplanation, setAiExplanation] = useState<string>("");
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const [explanationError, setExplanationError] = useState<string>("");
    const [isBaseQuestion, setIsBaseQuestion] = useState(true);


    const question = practiceQuestions[topic as keyof typeof practiceQuestions]?.[model as string];


    useEffect(() => {
      if (question?.variables) {
        const initialVars: Record<string, number> = {};
        Object.entries(question.variables).forEach(([key, config]) => {
          initialVars[key] = config.default;
        });
        setVariables(initialVars);
      }
    }, [question]);

    // Initialize session on mount
    useEffect(() => {
      const initSession = async () => {
        try {
          const session = await startSession({ topic: topic || "", model: model || "" });
          setSessionId(session.id);
        } catch (error) {
          console.error("Failed to start session:", error);
          toast({
            title: "Error",
            description: "Failed to start practice session",
            variant: "destructive",
          });
        }
      };
      initSession();
    }, [topic, model, startSession]);


    const calculateDynamicAnswer = useCallback(
      (modelId: string, vars: Record<string, number>): string => {
        const answerTemplate = practiceQuestions[topic as keyof typeof practiceQuestions]?.[modelId]?.answer;
        return answerTemplate ? interpolateTemplate(answerTemplate, vars) : "";
      },
      [topic]
    );


    const handleSubmit = useCallback(async () => {
      const dynamicAnswer = calculateDynamicAnswer(model || "", variables);
      
      // Normalize answers for comparison
      const normalizeAnswer = (ans: string) => {
        return ans.toLowerCase().trim()
          .replace(/\s+/g, ' ')  // normalize spaces
          .replace(/\.0+(%?)$/, '$1')  // 22.0% -> 22%
          .replace(/\/1$/, '')  // 63/1 -> 63
          .replace(/\.0+$/, '');  // 22.0 -> 22
      };
      
      const correct = normalizeAnswer(userAnswer) === normalizeAnswer(dynamicAnswer);
      setIsCorrect(correct);
      setIsTimerActive(false);

      const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);

      // Save question attempt
      try {
        if (sessionId) {
          await saveAttempt({
            sessionId,
            topic: topic || "",
            model: model || "",
            questionText: interpolateTemplate(question?.stem || "", variables),
            userAnswer,
            correctAnswer: dynamicAnswer,
            isCorrect: correct,
            timeTakenSeconds: timeTaken,
            hintUsed: showHint,
            variableValues: variables,
          });

          // Update user stats
          updateStats({
            questionsAttempted: 1,
            questionsCorrect: correct ? 1 : 0,
            studyTimeMinutes: Math.ceil(timeTaken / 60),
          });

          // Update topic progress
          await updateProgress({ accuracy: correct ? 100 : 0 });
        }

        // Use existing explanation for base question, generate AI for variants
        if (isBaseQuestion && question.explanation) {
          // Use pre-written explanation for base question
          setAiExplanation(interpolateTemplate(question.explanation, variables));
          setShowExplanation(true);
        } else {
          // Generate AI explanation for slider variants
          setIsLoadingAI(true);
          setAiExplanation("");
          setExplanationError("");
          setShowExplanation(true);

          try {
            const response = await fetch(
              `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-explanation`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
                },
                body: JSON.stringify({
                  questionText: interpolateTemplate(question?.stem || "", variables),
                  userAnswer,
                  correctAnswer: dynamicAnswer,
                  topic: topic || "",
                  model: model || "",
                  variables,
                  baseExplanation: question.explanation,
                }),
              }
            );

            if (!response.ok) {
              if (response.status === 429) {
                setExplanationError("Rate limit exceeded. Please try again later.");
                return;
              }
              if (response.status === 402) {
                setExplanationError("AI usage limit reached. Please add credits to continue.");
                return;
              }
              throw new Error("Failed to generate explanation");
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let explanation = "";

            if (reader) {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split("\n");

                for (const line of lines) {
                  if (line.startsWith("data: ")) {
                    const data = line.slice(6);
                    if (data === "[DONE]") continue;
                    try {
                      const parsed = JSON.parse(data);
                      const content = parsed.choices?.[0]?.delta?.content;
                      if (content) {
                        explanation += content;
                        setAiExplanation(explanation);
                      }
                    } catch (e) {
                      // Skip invalid JSON
                    }
                  }
                }
              }
            }
          } catch (error) {
            console.error("Error generating AI explanation:", error);
            setExplanationError("Failed to generate explanation. Please refresh to try again.");
          } finally {
            setIsLoadingAI(false);
          }
        }
      } catch (error) {
        console.error("Failed to save attempt:", error);
      }

      if (correct) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#8B5CF6", "#3B82F6", "#2DD4BF", "#EC4899"],
        });
        setIsDynamic(true);
      }
    }, [userAnswer, model, variables, calculateDynamicAnswer, sessionId, topic, saveAttempt, updateStats, updateProgress, showHint, question, questionStartTime]);


    useEffect(() => {
      let interval: NodeJS.Timeout;
      if (isTimerActive && timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev === 26) {
              setShowHint(true);
            }
            if (prev === 1) {
              setTimeout(() => {
                handleSubmit();
                setShowExplanation(true);
              }, 1000);
            }
            return prev - 1;
          });
        }, 1000);
      } else if (timeLeft === 0) {
        setIsTimerActive(false);
        setShowHint(true);
      }
      return () => clearInterval(interval);
    }, [isTimerActive, timeLeft, handleSubmit]);


    const handleVariableChange = useCallback((key: string, value: number) => {
      setVariables((prev) => ({ ...prev, [key]: value }));
      setIsBaseQuestion(false); // Mark as variant
      setAttempts((prev) => prev + 1);
      setUserAnswer("");
      setIsCorrect(null);
      setTimeLeft(50);
      setIsTimerActive(true);
      setShowHint(false);
      setShowExplanation(false);
      setAiExplanation("");
      setQuestionStartTime(Date.now());
    }, []);


    const resetTimer = useCallback(() => {
      setTimeLeft(50);
      setIsTimerActive(true);
      setShowHint(false);
    }, []);


    const handleEnd = useCallback(async () => {
      if (sessionId) {
        try {
          const totalTime = Math.floor((Date.now() - sessionStartTime) / 1000);
          await endSession({
            sessionId,
            totalQuestions: attempts,
            correctAnswers: isCorrect ? 1 : 0,
            timeSpentSeconds: totalTime,
          });
        } catch (error) {
          console.error("Failed to end session:", error);
        }
      }
      navigate(`/courses/quant/${topic}/${model}`);
    }, [navigate, topic, model, sessionId, endSession, attempts, isCorrect, sessionStartTime]);


    if (!question) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Question Not Found</h1>
            <p className="text-muted-foreground">
              The requested practice question could not be loaded.
            </p>
          </div>
        </div>
      );
    }


    const timeProgress = ((50 - timeLeft) / 50) * 100;
    const timeColor =
      timeLeft > 25
        ? "bg-primary"
        : timeLeft > 10
        ? "bg-energy"
        : "bg-destructive";


    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="uppercase">
                {topic?.replace("-", " & ")} - {model}
              </Badge>
              <Badge variant="secondary">Attempt #{attempts}</Badge>
            </div>


            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>End Practice Session?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to end this practice session? Your
                    progress will be saved.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Continue</AlertDialogCancel>
                  <AlertDialogAction onClick={handleEnd}>
                    End Session
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>


          {/* Timer */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-energy" />
                  <span className="font-semibold">Time Remaining</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold text-lg ${
                      timeLeft <= 10
                        ? "text-destructive"
                        : timeLeft <= 25
                        ? "text-energy"
                        : "text-primary"
                    }`}
                  >
                    {timeLeft}s
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={resetTimer}
                    disabled={!isTimerActive}
                  >
                    {/* Remove Reset Timer button if required per UI */}
                  </Button>
                </div>
              </div>
              <Progress value={timeProgress} className={`h-3 ${timeColor}`} />
            </CardContent>
          </Card>


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Question Card */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Question</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 rounded-lg bg-muted/50 text-lg">
                    <MathRenderer>
                      {interpolateTemplate(question.stem, variables)}
                    </MathRenderer>
                  </div>


                  <div>
                    <Label
                      htmlFor="answer"
                      className="text-base font-semibold"
                    >
                      Your Answer
                    </Label>
                    <Input
                      id="answer"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Enter your answer..."
                      className="mt-2 text-lg"
                      disabled={isCorrect !== null}
                    />
                  </div>


                  <div className="flex gap-3">
                    <Button
                      onClick={handleSubmit}
                      disabled={!userAnswer.trim() || isCorrect !== null}
                      variant="mathematical"
                      size="lg"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Submit Answer
                    </Button>


                    {isCorrect !== null && (
                      <Badge
                        variant={isCorrect ? "secondary" : "destructive"}
                        className="px-4 py-2 text-sm"
                      >
                        {isCorrect ? "Correct!" : "Incorrect"}
                      </Badge>
                    )}
                  </div>


                  {/* Result Status */}
                  {isCorrect === true && (
                    <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                      <div className="flex items-center gap-2 text-success">
                        <Check className="h-5 w-5" />
                        <span className="font-semibold">Excellent work!</span>
                      </div>
                      <p className="text-sm mt-1">
                        You can now adjust the variables below to practice with
                        different variations.
                      </p>
                    </div>
                  )}


                  {isCorrect === false && (
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                      <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        <span className="font-semibold">Try again!</span>
                      </div>
                      <p className="text-sm mt-1">
                        The correct answer is:{" "}
                        <strong>
                          {calculateDynamicAnswer(model || "", variables)}
                        </strong>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>


              {/* Dynamic Variables */}
              {isDynamic && question.variables && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Practice Variations
                    </CardTitle>
                    <CardDescription>
                      Adjust the parameters below to generate new question
                      variations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(question.variables).map(
                      ([key, config]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="capitalize">
                              {key.replace("_", " ")}
                            </Label>
                            <span className="text-sm font-medium">
                              {variables[key]}
                            </span>
                          </div>
                          <Slider
                            value={[variables[key] || config.default]}
                            onValueChange={([value]) =>
                              handleVariableChange(key, value)
                            }
                            min={config.min}
                            max={config.max}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      )
                    )}
                  </CardContent>
                </Card>
              )}
            </div>


            {/* Sidebar */}
            <div className="space-y-6">
              {/* Hint Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-highlight" />
                    Hint
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {showHint ? (
                    <div className="p-3 rounded-lg bg-highlight/10 border border-highlight/20">
                      <MathRenderer className="text-sm">
                        {interpolateTemplate(question.hint, variables)}
                      </MathRenderer>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <HelpCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Hint will appear at 25 seconds</p>
                    </div>
                  )}
                </CardContent>
              </Card>


              {/* Explanation Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {showExplanation ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                      Explanation
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setShowExplanation(!showExplanation)
                      }
                      disabled={isCorrect === null}
                    >
                      {showExplanation ? "Hide" : "Show"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {showExplanation ? (
                    <div className="space-y-3">
                      {isLoadingAI && !aiExplanation && (
                        <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                          <div className="flex items-center gap-2 text-accent">
                            <Sparkles className="h-4 w-4 animate-pulse" />
                            <span className="text-sm">Generating AI explanation...</span>
                          </div>
                        </div>
                      )}
                      {explanationError && (
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                          <p className="text-sm text-destructive">{explanationError}</p>
                        </div>
                      )}
                      {aiExplanation && (
                        <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                          <div className="flex items-center gap-2 mb-2 text-accent">
                            <Sparkles className="h-4 w-4" />
                            <span className="text-xs font-semibold">AI Explanation</span>
                          </div>
                          <MathRenderer className="text-sm leading-relaxed">
                            {aiExplanation}
                          </MathRenderer>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        {isCorrect === null
                          ? "Submit your answer to view explanation"
                          : "Click Show to view explanation"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

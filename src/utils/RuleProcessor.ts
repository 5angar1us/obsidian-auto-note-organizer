import { parse } from 'logical-expression-parser';

export interface Rule {
  pathSpec: string;
  tagMatch?: string; // todo: settings.use_regex_to_check_for_tags
  // titleMatchRegex?: RegExp;
}

export interface FileMetadata {
  frontmatter: Record<string, unknown>;
  title: string;
  tags: string[];
}

export function parseTest(input: string): { parameter: string, value: string } {
    
  // parse {{ something[else], something[653,35] }}
  // /^(\w+)\[([0-9,]+|[^\W\d][\w]*)\]$/
  const parameterRegexPart = '^([\\w]+)' //something

  const numbersWithCommas = '([0-9,]+)'; 
  const stringInBrackets = '([^\W\\d][\\w]*)'; 

  const regexString = `${parameterRegexPart}\\[(${numbersWithCommas}|${stringInBrackets})\\]$`;
  const regex = new RegExp(regexString);

  const match = input.match(regex);
  if (match) {
      return { parameter: match[1], value: match[2] };
  }
  // error
  return { parameter: '!!!', value: 'nfg' };
}

export class RuleProcessor {
  constructor(private rules: Rule[]) {}

  getDestinationPath(fileMetadata: FileMetadata): string | false {
    for (const rule of this.rules) {
      if (this.ruleMatches(rule, fileMetadata)) {
        const path = this.processPathSpec(rule.pathSpec, fileMetadata.frontmatter);
        if (path) {
          return path;
        }
      }
    }
    return false;
  }
  


  private expressionEvaluator(condition: string, fileMetadata: FileMetadata): boolean {
    const { parameter, value } = parseTest(condition);
    let answer = false;
    switch(parameter) {
      case '!!!':
        break;
      case 'has':
        answer = this.hasFrontmatterTest(value, fileMetadata);
        break;
      case 'tag':
        answer = this.tagTest(`#${value}`, fileMetadata);
        break;
      case 'title':
        answer = this.titleTest(value, fileMetadata);
        break;
      default:
        answer = this.frontmatterTest(parameter, value, fileMetadata);
        break;
    }
    // console.log('condition', condition, answer);
    return answer;
  }

  private tagTest = (tag: string, fileMetadata: FileMetadata) => fileMetadata.tags.includes(tag);
  private titleTest = (title: string, fileMetadata: FileMetadata) => new RegExp(title).test(fileMetadata.title);
  private hasFrontmatterTest = ( property: string, fileMetadata: FileMetadata) => {
    const propVal = fileMetadata.frontmatter[property];
    return !!(Array.isArray(propVal) ? propVal[0] : propVal);
  }
  private frontmatterTest = ( property: string, value: string, fileMetadata: FileMetadata) => {
    const propVal = fileMetadata.frontmatter[property];

    //A value will be returned from the frontmatter property with the checkbox type, for example: {{{true}}}
    //after parsing the query we get {{“true”}}}
    //
    //A value will be returned from the frontmatter property with the number type, for example: {{{5}}}
    //after parsing the query we get {{“5”}}}

    if(typeof propVal === "boolean" ){
      return String(propVal) === value
    }

    if(typeof propVal === "number"){
      return propVal === this.parseInt(value)
    }
   
    return value === (Array.isArray(propVal) ? propVal[0] : propVal);
  }

  private parseInt(intStr:string){
    const intStrSeparatedByDot = intStr.replace(",", ".")
    return Number(intStrSeparatedByDot)
  }

  private ruleMatches(rule: Rule, fileMetadata: FileMetadata): boolean {
    if (!rule.tagMatch) {
      // match everything
      return true;
    }

    if (rule.tagMatch) {
      if (rule.tagMatch.startsWith('=')) {
        rule.tagMatch = rule.tagMatch.substring(1);
      }
      return parse(rule.tagMatch, (cond: string) => this.expressionEvaluator(cond, fileMetadata));
    }
    
    return false;
  }

  private processPathSpec(pathSpec: string, frontmatter: Record<string, unknown>): string | false {
    const pattern = /<([^>]+)>/g;
    let path = pathSpec;
    let match;
    while ((match = pattern.exec(pathSpec)) !== null) {
      const token = match[1];
      const propVal = frontmatter[token];
      if (propVal !== undefined) {
        const firstValue = Array.isArray(propVal) ? propVal[0] : propVal;
        if (firstValue) {
          path = path.replace(`<${token}>`, String(firstValue));
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
    return path;
  }
}
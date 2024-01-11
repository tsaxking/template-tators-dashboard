<script lang='ts'>
    export let searchKey: string = '';
    export let searchOptions: string[] = [];
    export let similarStrings: string[] = [];
    /*Returns the levenshtein distance between two strings, which
    is the minimum number of single-character edits required to change one string into the other*/
    function levenshteinDistance(str1: string, str2: string) {
        const len1 = str1.length;
        const len2 = str2.length;
  
       let matrix = Array(len1 + 1);
     for (let i = 0; i <= len1; i++) {
       matrix[i] = Array(len2 + 1);
     }
  
       for (let i = 0; i <= len1; i++) {
       matrix[i][0] = i;
     }
  
     for (let j = 0; j <= len2; j++) {
       matrix[0][j] = j;
     }
  
     for (let i = 1; i <= len1; i++) {
       for (let j = 1; j <= len2; j++) {
         if (str1[i - 1] === str2[j - 1]) {
           matrix[i][j] = matrix[i - 1][j - 1];
         } else {
           matrix[i][j] = Math.min(
             matrix[i - 1][j] + 1,
             matrix[i][j - 1] + 1,
             matrix[i - 1][j - 1] + 1
           );
         }
       }
     }
  
        return matrix[len1][len2];
    }
    
    /*Checks an inputted string against an array of strings, and returns an array of all strings from the inputted array it deems
    to be similar with the inputted string. */


    //NOTE FOR SELF: NEED TO COMPARE NEEDLE'S LENGTH WITH SOMEHAY'S LENGTH 
    function checkStrings(needle: String, haystack:string[]) {
        similarStrings.length = 0;
        for(let someHay of haystack) {
            if(levenshteinDistance(searchKey, someHay) <= 3){
                similarStrings.push(someHay);
            }
            else if(needle.length >= someHay.length) {
                let areSame:boolean = true;
                for(let i = 0; i<needle.length; i++) {
                    if(needle[i] != someHay[i]){
                        areSame = false;
                    } 
                }
                if(areSame) {
                    similarStrings.push(someHay);
                }
            }
        }
    }

    console.log(checkStrings(searchKey, searchOptions))
</script>

<input bind:value={searchKey}/>

<button on:click={checkStrings(searchKey, searchOptions)}>Search</button>

{#each similarStrings as str}
  <ul>
    {str}
  </ul>
{/each}


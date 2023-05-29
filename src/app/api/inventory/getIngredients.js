import supabase from "../../../../supabase";

async function getIngredients() {
    try {
        // select all from the ingredients table
        // SELECT *
        // FROM ingredients
        let { data: ingredients, error } = await supabase
            .from('ingredients')
            .select('*');
            

        if (error) {
            throw error;
        }
        console.log(ingredients);
        return ingredients;
    } catch (error) {
      console.error(error);
    }
  }

export {
    getIngredients
};

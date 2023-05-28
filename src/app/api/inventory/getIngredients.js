import supabase from "../../../../supabase";

async function getIngredients() {
    try {
        let { data: ingredients, error } = await supabase
            .from('ingredients')
            .select('*')

        if (error) {
            throw error;
        }

        return ingredients;
    } catch (error) {
      console.error(error);
    }
  }

export default getIngredients;

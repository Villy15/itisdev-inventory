import { NextResponse } from 'next/server';
import supabase from '../../../../supabase';

export async function POST(req) {
    try {
        const { username, password } = await req.json();

        let { data: user, error } = await supabase
            .from('users').
            select('*').
            eq('username', username);
        
        if (error) {
            throw error;
        }
        
        // If user not found, return User Invalid as response
        if (user.length === 0) {
            return NextResponse.json('User Invalid');

        // Else, return the found user as response
        } else  {
            return NextResponse.json({ user });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.error(error);
    }
}
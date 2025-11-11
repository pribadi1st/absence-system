import { NextRequest } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function DELETE(req: NextRequest, ctx: RouteContext<'/api/employees/[id]'>) {
    const { id } = await ctx.params
    const supabase = await createClient()
    const { status, error } = await supabase.from('employees').delete().eq('id', id)

    if (error) {
        return NextResponse.json({ error }, { status: 500 })
    }
    return NextResponse.json({ status })
}
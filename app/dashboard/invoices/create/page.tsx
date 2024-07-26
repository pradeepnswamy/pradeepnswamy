import Form from "@/app/ui/invoices/create-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchCustomers } from "@/app/lib/data";

export default async function Page() {
    const Customer = await fetchCustomers();

    return (
        <main>
            <Breadcrumbs 
                breadcrumbs={[
                    {label: 'Invoices', href: '/dashboard/invoices'},
                    {label: 'Create Invoice', href: '/dashboard/invoices/create', active: true},
                ]}/>
            <Form customers={Customer}/>
        </main>
    );
}
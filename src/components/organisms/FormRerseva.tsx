import { InputEmail } from "../atoms/InputEmail";

interface FormRersevaProps {

}

export const FormRerseva = (props: FormRersevaProps) => {


    return (
        <>
            <form>
                <input type="text"  name="buyerName" placeholder="Nombre de cliente"/>
                <input type="email" name="buyerEmail" placeholder="Correo de cliente"/>
            </form>
        </>
    );
}

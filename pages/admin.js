import Layout from "@/components/Layout";

export default function Admin() {

    return (
      <Layout>
        <h1>Admins</h1>
        <form className="flex gap-1 mb-8">
                <input 
                    className="mb-0" 
                    type="text" 
                    placeholder={'Email'}
                     />
                <button type="submit" className="btn-primary text-sm">Add</button>
        </form>
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Full name</td>
              <td>Email</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </Layout>
    );
}
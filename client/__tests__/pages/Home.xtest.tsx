// import { getByTestId, render, screen, userEvent } from '../test-utils';
// import Home from '../../Routes/Home';
// import {
//   BrowserRouter,
//   createBrowserRouter,
//   MemoryRouter,
//   MemoryRouterProps,
// } from 'react-router-dom';
// import TestRenderer from 'react-test-renderer';



// describe('Home ', () => {
//   test('checks if 5 is 5', () => {
//     const num = 5;
//     expect(num).toEqual(5);
//   })
//   test('checks if home component renders without errors', ()=>{
//     render(<MemoryRouter>
        
//             <Home/>
        
        
//     </MemoryRouter>)
//   })
//   test('checks if page redirects to default dashboard upon page load', ()=>{
//     render(<MemoryRouter><Home/></MemoryRouter>)
//   })
// });



// // describe('Home.tsx', () => {
// //   it('redirects to default dashboard upon page load', () => {
// //     const Home = TestRenderer.create(<Home/>).toJSON();
// //     render(<Home />, { wrapper: BrowserRouter });
// //     expect(screen.getByText('Kubernetes Dashboard')).toBeInTheDocument();
// //   });
// //   it('changes the url to default dashboard URL', () => {
// //     render(<Home />, { wrapper: BrowserRouter });
// //     expect(global.window.location.href).toContain('/0');
// //   });
// // });


// describe('Home.tsx', ()=>{
//     it('test the children inside Home component', ()=>{
//         const home = TestRenderer.create(<MemoryRouter><Home/></MemoryRouter>).toJSON();
//         console.log(home);


//     })
// })
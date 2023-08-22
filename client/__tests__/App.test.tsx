// import App from '../App.tsx';
// import Dashboard from '../Components/Dashboard/Dashboard.tsx';
// import ClusterView from '../Routes/ClusterView.tsx';
// import Home from '../Routes/Home.tsx';
// import SetUp from '../Routes/SetUp.tsx';
// import { render, screen } from './test-utils';
// import * as loaders from '../context/loaders';
// import {
//   RouterProvider,
//   createMemoryRouter,
//   MemoryRouter,
//   Route,
//   createRoutesFromElements,
// } from 'react-router-dom';

// const mockRoutes = [
//   {
//     path: '/',
//     element: <Home />,
//     loader: vi.fn(),
//     id: 'home',
//     children: [
//       {
//         path: ':id',
//         element: <Dashboard />,
//       },
//       {
//         path: 'clusterview',
//         element: <ClusterView />,
//         loader: vi.fn(),
//         id: 'cluster',
//       },
//       {
//         path: 'setup',
//         element: <SetUp />,
//       },
//     ],
//   },
// ];

// describe('App Component Test', () => {
//   test('renders without crashing', () => {
//     const { container } = render(<App />);
//     expect(container).toBeInTheDocument();
//   });
// });

// describe('App is providing routing capability to child components', async () => {
//   const router = createMemoryRouter(mockRoutes, {
//     initialEntries: ['/'],
//     initialIndex: 0,
//   });
//   render(<RouterProvider router={router} />);
//   expect(() => screen.queryByText('Kubernetes Dashboard'));
// });

// describe('creating routes from elements', () => {
//   it('creates a route config of nested Typescript components', () => {
//     expect(
//       createRoutesFromElements(
//         <Route path='/' element={<Home />} loader={loaders.userLoader} id='home'>
//           <Route path=':id' element={<Dashboard />} />
//           <Route
//             path='clusterview'
//             element={<ClusterView />}
//             loader={loaders.clusterLoader}
//             id='clusterview'
//           />
//           <Route path='setup' element={<SetUp />} />
//         </Route>,
//       ),
//     ).toMatchInlineSnapshot(`
//       [
//         {
//           "Component": Home,
//           "ErrorBoundary": undefined,
//           "action": undefined,
//           "caseSensitive": undefined,
//           "children": [
//             {
//               "Component": <Dashboard/>,
//               "ErrorBoundary": undefined,
//               "action": undefined,
//               "caseSensitive": undefined,
//               "element": <Dashboard/>
//               "errorElement": undefined,
//               "handle": undefined,
//               "hasErrorBoundary": false,
//               "id": undefined,
//               "index": undefined,
//               "lazy": undefined,
//               "loader": undefined,
//               "path": ":id",
//               "shouldRevalidate": undefined,
//             },
//             {
//               "Component": undefined,
//               "ErrorBoundary": undefined,
//               "action": undefined,
//               "caseSensitive": undefined,
//               "element": <ClusterView/>,
//               "errorElement": undefined,
//               "handle": undefined,
//               "hasErrorBoundary": false,
//               "id": "home",
//               "index": undefined,
//               "lazy": undefined,
//               "loader": loader.clusterLoader,
//               "path": "clusterview",
//               "shouldRevalidate": undefined,
//             },
//             {
//               "Component": undefined,
//               "ErrorBoundary": undefined,
//               "action": undefined,
//               "caseSensitive": undefined,
//               "element": <SetUp/>,
//               "errorElement": undefined,
//               "handle": undefined,
//               "hasErrorBoundary": false,
//               "id": "0-2",
//               "index": undefined,
//               "lazy": undefined,
//               "loader": undefined,
//               "path": "/setup",
//               "shouldRevalidate": undefined,
//             },
//           ],
//           "element": <Home/>
//           "errorElement": undefined,
//           "handle": undefined,
//           "hasErrorBoundary": false,
//           "id": home,
//           "index": undefined,
//           "lazy": undefined,
//           "loader": loaders.userLoader
//           "path": "/",
//           "shouldRevalidate": undefined,
//         },
//       ]
//     `);
//   });


//   // it('throws when the index route has children', () => {
//   //   expect(() => {
//   //     createRoutesFromChildren(
//   //       <Route path='/'>
//   //         {/* @ts-expect-error */}
//   //         <Route index>
//   //           <Route path='users' />
//   //         </Route>
//   //       </Route>,
//   //     );
//   //   }).toThrow('An index route cannot have child routes.');
//   // });

//   it('supports react fragments for automatic ID generation', () => {
//     expect(
//       createRoutesFromElements(
//         <Route path='/' element={<Home/>} loader={loaders.userLoader}>
//           <Route path=':id' element={<Dashboard/>} />
//           <Route
//             path='clusterview'
//             element={<ClusterView />}
//             loader={loaders.clusterLoader}
//             id='clusterview'
//           />
//           <Route path='setup' element={<SetUp />} />
//         </Route>,
//       ),
//     ).toEqual([
//       {
//         path: '/',
//         element: <Home/>,
//         hasErrorBoundary: false,
//         children: [
//           {
//             path: ':id',
//             element: <Dashboard/>,
//             hasErrorBoundary: false,
//           },
//           {
//             id: 'clusterview',
//             path: 'clusterview',
//             element: <ClusterView/>,
//             hasErrorBoundary: false,
  
//           },
//           {
//             path: 'setup',
//             element: <SetUp/>,
//             hasErrorBoundary: false,
//           },
//         ],
//       },
//     ]);
//   });
// });

// // vi.mock('react-router-dom', () => ({
// //   createBrowserRouter: vi.fn(),
// //   createRoutesFromElements: vi.fn(),
// //   useLoaderData: vi.fn(),
// //   useRouteLoaderData: vi.fn(),
// //   useNavigate: vi.fn(),
// // }));

// // const mockRouter = {
// //   navigate: vi.fn(),
// //   getCurrentRoute: vi.fn(),
// //   useLoaderData: vi.fn(),
// //   useRouteLoaderData: vi.fn(),
// // };

// // mockRouter.setup(() => {
// //   createRoutesFromElements.$mock(() => mockRoutes);
// // });

// // const TestingComponent = () => {
// //   const { hasFetchedUserData, currentDashboard }: any =
// //     useContext(StoreContext);
// //   return (
// //     <div>
// //       <p data-testID='dashboard'>{currentDashboard.toString()}</p>
// //       <p data-testID='hasFetched'>{hasFetchedUserData.toString()}</p>
// //     </div>
// //   );
// // };
// // const hasFetched = {
// //   currentDashboard: 'default',
// // };
// // const hasNotFetched = {
// //   currentDashboard: undefined,
// // };

// // describe('Testing Store Provider Context', () => {
// //     let providerProps;
// //     beforeEach(()=>{
// //         (providerProps={
// //             dashboard: 'default',
// //             hasFetchedUserData: true,
// //         })
// //     })

// //     test('provides expected State object to child elements', ()=>{
// //         render( <TestingComponent/>, {providerProps});
// //         expect(screen.queryByTestId('dashboard')).toEqual('default');
// //         expect(screen.queryByTestId('hasFetched')).toEqual('true');

// //     })
// // })

// // describe('<StoreProvider/>', () => {
// //   test('provides expected States object to child elements', () => {
// //     [
// //       {
// //         scenario: 'has fetched',
// //         currentDashboard: hasFetched,
// //         expectedDashboard: 'default',
// //         expectedFetch: 'true',
// //       },
// //       {
// //         scenario: 'has not fetched',
// //         currentDashboard: hasNotFetched,
// //         expectedDashboard: undefined,
// //         expectedFetch: 'false',
// //       },
// //     ].forEach(({ scenario, currentDashboard, expectedDashboard, expectedFetch }) => {
// //       test(scenario, () => {
// //         const { getByTestId } = render(
// //           <StoreContext.Provider>
// //             <TestingComponent />
// //           </StoreContext.Provider>,
// //         );
// //       });
// //       expect(screen.getByTestId('dashboard')).toEqual(expectedDashboard);

// //       expect(screen.queryByTestId('hasFetched')).toEqual(expectedFetch);

// //     });
// //   });
// // });

// // // describe('')

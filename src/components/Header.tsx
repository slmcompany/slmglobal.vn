import { useState } from 'react'
import { Dialog, DialogPanel, PopoverGroup } from '@headlessui/react'
import { Bars2Icon, XMarkIcon } from '@heroicons/react/24/outline'

const navigation = [
	{ name: 'Ground screws', href: '/ground-screws' },
	{ name: 'Quartz stone', href: '/quartz-stone' },
	{ name: 'Rubber', href: '/rubber' },
	{ name: 'Plywood', href: '/plywood' },
	{ name: 'About us', href: '/about-us' },
	// { name: "Media", href: "/media" },
	{ name: 'Contact us', href: '/contact-us' }
]

const mobilenavigation: {
	heading: string
	submenu: {
		title: string
		link: string
		icon: string
		button?: { btn: string; link: string }[]
	}[]
}[] = [
	{
		heading: 'Products',
		submenu: [
			{
				title: 'Ground screws',
				link: '/ground-screws',
				icon: ''
			},
			{
				title: 'Quartz stone',
				link: '/quartz-stone',
				icon: ''
			},

			{
				title: 'Rubber',
				link: '/rubber',
				icon: ''
			},
			{
				title: 'Plywood',
				link: '/plywood',
				icon: ''
			}
		]
	},
	{
		heading: 'Company',
		submenu: [
			{
				title: 'About us',
				link: '/about-us',
				icon: ''
			},
			// {
			//   title: "Media",
			//   link: "/media",
			//   icon: "",
			// },
			{
				title: 'Contact',
				link: '/',
				icon: ''
			}
		]
	}
]

export default function Example() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

	return (
		<header className="fixed isolate z-10 w-full bg-white bg-opacity-70 bg-clip-padding backdrop-blur-sm backdrop-filter md:relative md:bg-white">
			<nav
				aria-label="Global"
				className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
			>
				<div className="flex lg:flex-1">
					<a href="/" className="-m-1.5">
						<span className="sr-only">SoLarMax</span>
						<img alt="" src="/images/slmglobal-logo.svg" className="h-8 w-auto lg:h-8" />
					</a>
				</div>

				<div className="flex items-center space-x-6 md:order-2">
					<a
						href="https://slmglobal.trustpass.alibaba.com/"
						className="text-gray-900 hover:text-gray-400"
						target="_blank"
					>
						<span className="sr-only">Alibaba</span>
						<div className="flex h-8 w-8 items-center">
							<img className="" src="/images/alibaba-svgrepo-com.svg" />
							<span className="text-nowrap font-bold">Find us on Alibaba</span>
						</div>
					</a>
				</div>

				<div className="flex lg:hidden">
					<button
						type="button"
						onClick={() => setMobileMenuOpen(true)}
						className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
					>
						<span className="sr-only">Open main menu</span>
						<Bars2Icon aria-hidden="true" className="h-6 w-6" />
					</button>
				</div>

				<PopoverGroup className="hidden lg:flex lg:gap-x-12">
					{navigation.map((item) => (
						<a
							key={item.name}
							href={item.href}
							className="text-sm font-semibold leading-6 text-gray-900"
						>
							{item.name}
						</a>
					))}
				</PopoverGroup>

				<div className="hidden lg:flex lg:flex-1 lg:justify-end">
					{/* <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
						Login <span aria-hidden="true">&rarr;</span>
					</a> */}
				</div>
			</nav>
			<Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
				<div className="fixed inset-0 z-10" />
				<DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-gray-100 p-3 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
					<div className="flex items-center justify-between">
						<a href="/" className="-m-1.5 p-1.5">
							<span className="sr-only">SoLarMax</span>
							<img alt="" src="/images/slmglobal-logo.svg" className="h-8 w-auto" />
						</a>
						<button
							type="button"
							onClick={() => setMobileMenuOpen(false)}
							className="-m-2.5 rounded-md p-2.5 text-gray-700"
						>
							<span className="sr-only">Close menu</span>
							<XMarkIcon aria-hidden="true" className="h-6 w-6" />
						</button>
					</div>

					<div className="mb-24 mt-6 flow-root">
						<div className="-my-6 divide-y divide-gray-500/10">
							<div className="space-y-2 py-6">
								<div className="-mx-3">
									{mobilenavigation.map((item, index) => (
										<div
											key={index}
											className="w-full py-2 pl-3 pr-3.5 text-xl font-semibold leading-7 text-gray-900"
										>
											{item.heading}
											<div
												className="mt-2 divide-y divide-gray-100 rounded-md bg-white shadow"
												id="disclosure-1"
											>
												{item.submenu.map((submenuItem, subIndex) => (
													<a
														key={subIndex}
														href={submenuItem.link}
														className="block py-2 pl-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-green-100"
													>
														<button
															type="button"
															className="flex w-full items-center justify-between pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-green-100"
														>
															<div className="flex items-center">
																<img alt="" src={submenuItem.icon} className="h-8 w-auto pr-2" />
																<p className="text-nowrap">{submenuItem.title}</p>
															</div>
															<div className="flex gap-2">
																{submenuItem.button
																	?.filter((btnItem) => btnItem) // Filter out undefined or null button items
																	.map((btnItem, btnIndex) => (
																		<a
																			key={btnIndex}
																			href={btnItem.link}
																			className="rounded-md border-2 border-slate-800 px-2"
																		>
																			{btnItem.btn}
																		</a>
																	))}
															</div>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																fill="none"
																viewBox="0 0 24 24"
																strokeWidth={1.5}
																stroke="currentColor"
																className="size-5"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	d="m8.25 4.5 7.5 7.5-7.5 7.5"
																/>
															</svg>
														</button>
													</a>
												))}
											</div>
										</div>
									))}
									{/* <div style={{margin:"15px 10px 10px 10px", borderRadius:"10px", position: 'relative', paddingBottom: '53.25%', height: 0, overflow: 'hidden', maxWidth: '100%', background: '#000' }}>
  <iframe
    width="560"
    height="315"
    src="https://www.youtube.com/embed/7rnvOZWwh5I?feature=oembed&showinfo=0"
    title="YouTube video player"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerPolicy="strict-origin-when-cross-origin"
    allowFullScreen
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
  ></iframe>
</div>                  */}
								</div>
							</div>
						</div>
					</div>
				</DialogPanel>
			</Dialog>
		</header>
	)
}

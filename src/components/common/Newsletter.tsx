"use client";

import React from 'react';
import Button from './Button';

const Newsletter = () => {
    return (
        <section className="py-[60px] lg:py-[100px] bg-[#ededed] text-black">
            <div className="max-w-[100vw] mx-auto px-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 lg:gap-[60px]">
                <div className="max-w-[600px]">
                    <h2 className="text-[48px] lg:text-[60px] font-black leading-[0.95] uppercase mb-5 font-sans tracking-[-1px]">
                        SUBSCRIBE TO OUR<br />
                        NEWSLETTER NOW!
                    </h2>
                    <p className="text-lg leading-[1.6] text-[#666666] max-w-[500px]">
                        Get top Framer components, exclusive freebies, and expert tips
                        delivered to your inbox weekly.
                    </p>
                </div>

                <div className="flex-1 w-full max-w-full lg:max-w-[550px] flex flex-col gap-[15px]">
                    <form className="flex flex-col sm:flex-row gap-[15px] w-full">
                        <input
                            type="email"
                            placeholder="jane@email.com"
                            className="flex-1 h-16 rounded-[32px] border border-transparent px-[30px] py-4 text-lg outline-none bg-white text-[#333] transition-all focus:border-black"
                            required
                        />
                        <Button
                            type="submit"
                            text="Subscribe"
                            variant="black"
                            size="md"
                            showArrow={false}
                            className="w-full sm:w-auto mt-0"
                        />
                    </form>
                    <p className="text-sm text-[#888888] ml-5">
                        Weekly newsletter. Unsubscribe anytime.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;

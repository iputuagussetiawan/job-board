"use client";
import React from 'react'

interface UploadingProgressProps {
    progress: number;
}

function UploadingProgressStatus({progress}: UploadingProgressProps) {
    return (
        <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                className="text-gray-200 stroke-current"
                strokeWidth={10}
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                ></circle>

                <circle
                className="text-indigo-500 animate-pulse  progress-ring__circle stroke-current transition-all duration-500"
                //stroke-width="10"
                strokeWidth={10}
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={`calc(251.2 - (251.2 * ${progress}) / 100)`}
                ></circle>
                <text
                x="50"
                y="50"
                fontFamily="Verdana"
                fontSize="12"
                textAnchor="middle"
                alignmentBaseline="middle"
                >
                {progress.toFixed(2)}%
                </text>
            </svg>
        </div>
    )
}

export default UploadingProgressStatus

import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../context/stateStore';

const SetUp = () => {
  return (
    <div>
      <h1>Welcome to Anago!</h1>

      <p>
        Anago, or anágō, as properly styled in Ancient Greek, means to lead to a
        higher place, to uplift, and to take to sea. In this spirit, Team Anago
        hopes to serve as a perfect compass for your deployments on the
        Kubernetes platform. (Kubernetes, as we know, is an Ancient Greek word
        for 'captain', or 'helmsman'. Clearly one of our team members studied
        Classics in university.) Let's dive in to how to set up and use our
        platform so Anago can simplify and streamline managing your Kubernetes
        deployments.
      </p>

      <img
        src='../assets/images/anagoDef.png'
        alt='Wikipedia definition for "anago"'
      />

      <ol className='table-of-contents'>
        <h2>Table of Contents</h2>
        <li>
          <a>Getting Started</a>
        </li>
        <li>
          <a>Configure Your Dashboard</a>
        </li>
        <li>
          <a>How to Customize Metrics</a>
        </li>
        <li>
          <a>Manage Your Alerts</a>
        </li>
        <li>
          <a>Clusterview Visualizer</a>
        </li>
      </ol>

      <h2>Getting Started</h2>
      <p>
        Team Anago is equipped for monitoring Kubernetes clusters hosted both on
        local servers and on cloud-based platforms. Our primary cloud-support is
        with the Amazon Web Services (AWS) Elastic Kubernetes Service (EKS)
        platform, and we provide out of the box support for Prometheus API and
        Prometheus Alertmanager integration with Chart.JS. Anago is meant to be
        tech-stack agnostic, so let's walk you through how to connect any of
        your Kubernetes deployments to Anago.
      </p>
      <ol>
        <li></li>
      </ol>
    </div>
  );
};

export default SetUp;

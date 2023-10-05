---
layout: post
title: "Accelerating Surrogate Model Development with Multiple Physics Pretraining"
shorttitle: "Learning Multiple Physics"
date: 2023-10-09
smallimage: physics_circle-s.png
image: physics_circle.png
---

However, all of these successes are built from scratch. Learning new systems requires large datasets and larger training times every time. This limits the accessibility of these methods for many physical systems of interest to the largest, most compute-rich organizations.

#### Does this need to be the case?

The fields of natural language processing and computer vision have been revolutionized by the emergence of “foundation models”. These are large neural networks that have been pretrained on massive datasets using task-agnostic objective functions to learn features that are broadly useful across wide ranges of tasks. These features have proven to be unexpectedly effective on a wide range of tasks. Most importantly, fine-tuning these features to new tasks drastically reduces the required data and training time compared to building new models from scratch, making their use more widely accessible. 

At a fundamental level, many physical systems also share underlying principles. The transport equations describe wide ranges of phenomena in fluids. More universal properties like conservation laws and invariances persist across diverse disciplines including fluids, climate science, astrophysics, and chemistry. 

The success of pretraining in other fields and the existence of these shared principles gives rise to an interesting question:

*Can we learn these shared features ahead of time through pretraining and accelerate the development of models for new physical systems?*

For this approach to be useful, we not only need to build models capable of transfer — this is something we already do today — we also need models capable of learning multiple physical dynamics simultaneously to maximize their coverage.


#### Multiple Physics Pretraining 

Our pretraining approach can be described in two steps:

<p align="center">
  <img src="/images/blog/mpp_arch_v5.png" alt="Multiphysics Pretraining">
</p>

1. Project the state variables from multiple physical systems into a shared normalized embedding space.
2. Train a single scalable transformer model to predict the next step of a spatiotemporal series based on a small number of snapshots describing the history.

For step one, we use a recent method from the time-series forecasting literature called Reversible Instance Normalization (text link to paper). This method unifies the scales of different datasets for ingestion into the network then re-injects the scale information back into the output.  These fields are then individually projected into a shared space.

From here, these can be processed by conventional transformers, but we have a particular demand for scalability since many physical systems we’d be interested in are quite large. To minimize the computational demand, we use an attention mechanism that looks only at one axis (time, height, width, ect) at a time to trade a bit of expressiveness for a significant amount of cost.

#### Single Models can Simultaneously Learn Diverse Physics

We test out this strategy using a benchmark dataset called PDEBench (highlight citation). This dataset was developed for systems governed by partial differential equations (PDEs) with a significant emphasis on fluid mechanics. 

Our models are able to compete with or beat modern baselines on all 2D time-dependent tasks in the benchmark despite the added difficulty of multi-task training.  In fact, we outperform the single-physics, dedicated baselines in all but one case, and in many cases, the performance of our models over the baseline is nearly an order of magnitude. 



#### Learning Multiple Physics Transfers to New Systems

Now, the most important detail is whether this pretraining actually improves learning on new tasks. We do this by completely removing compressible fluid simulations from the training corpus and evaluating whether training on only incompressible Navier-Stokes, incompressible shallow water, and diffusion-reaction simulations provides an advantage in learning the compressible simulations.

We then make two compressible datasets. We call one “near” and one “far”. 

<p align="center">
  <img src="/images/blog/multiphysics_ke.png" alt="Visualizing the physics gap.">
  <figcaption  style="padding-left:32px; padding-right:20px; line-height:1.3">On a field snapshot level, the incompressible flow included in the training set (left) has strong resemblence to the compressible simulation at low mach number (center) with similar diffusion levels, but the high mach number flow (right) develops significantly more complex, small-scale features as a result of both lower diffusion and more compressible behavior. </figcaption>
</p>


“Near” is generated from a compressible simulation, but operates at regimes that don’t have much new behavior. “Far” is simulated at high mach number, a regime where compressible effects are very strong. 

Comparing our approach to existing spatiotemporal foundation models and training from scratch, we show that our approach is able to significantly outperform both in the low-data regime. 



#### Next Steps 

Our work so far is still limited by the resolution and diversity of the training data. Creating true foundation models for general physics is going to require broader, deeper datasets capturing more behavior and at higher resolutions. There remains work to be done, but we’ve shown a path forward by introducing a new pretraining approach that allows us to train models that both learn multiple sets of diverse physics and effectively transfer to new physics. 
. 

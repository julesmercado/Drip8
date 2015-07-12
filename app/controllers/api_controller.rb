class ApiController < ApplicationController


	def new_user
		@user = User.create(user_params)
		bucket_info = ["who I am","what I do","what I am proud of"]
		bucket_info.each do |name|
			@bucket = Dripbucket.create(:name => name, :user_id => @user.id, :state => "public")
		end

		render json: {:status => "success" , :user => @user} ,status: :created
	end

	def read_drips_by_bucket_and_user

		@drips = Drip.where(:user_id => params[:user_id]).where(:dripbucket_id => params[:dripbucket_id])
		render json: { :status => "success" , :drips => @drips }, status: :created 
		
	end

	def read_all_bucket_by_user
		@user = User.find_by_id(params[:user_id])
		@buckets = @user.dripbuckets
		render json: {:status => "success", :buckets => @buckets}, status: :created
	end

	def add_bucket
		@bucket = Dripbucket.create(bucket_params)
		render json: {:status => "success", :bucket => @bucket}, status: :created
	end

	def read_all_drips_by_user
		@drips = Drip.where(:user_id => params[:user_id])
		render json: {:status => "success" ,:drips => @drips } , status: :created
	end

	def add_drip
		@drip = Drip.create(drip_params)
		render json: {:status => "success" , :drip => @drip} ,status: :created
	end

	def login
		@user = User.find_by_email(params[:email])
		@drips = @user.drips
		render json: {:status => "success", :user =>@user, :drips => @drips}, status: :created
		
	end



	private

	def drip_params
		params.require(:drip).permit(:link, :title, :description, :state, :user_id, :dripbucket_id)
	end

	def user_params
		params.require(:user).permit(:email, :name, :profile_picture)
	end

	def bucket_params
		params.require(:bucket).permit(:user_id, :name, :state)
	end
end
